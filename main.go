package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path"
	"strings"
	"text/template"

	"github.com/yosssi/gohtml"
)

const HELP = `Usage: %s [options]

  Options:
    help      Display this help text

    build     Build the site
      inclts  Include TypeScript (.ts) files in the output

    serve     Serve the site
`

var includeTSFiles = false

func main() {
	cmd := os.Args[0]
	args := os.Args[1:]

	if len(args) == 0 {
		fmt.Printf(HELP, cmd)
		fmt.Println("\nNo options provided!")
		os.Exit(1)
	}

	doHelp := false
	doBuild := false
	doServe := false
	for _, arg := range args {
		switch strings.ToLower(arg) {
		case "help":
			doHelp = true

		case "build":
			doBuild = true

		case "inclts":
			includeTSFiles = true

		case "serve":
			doServe = true

		default:
			fmt.Printf("Unknown option: '%s'!\nUse '%s help'\n", arg, cmd)
			os.Exit(1)
		}
	}

	if doHelp {
		fmt.Printf(HELP, cmd)
		if doBuild || doServe {
			fmt.Println("\nOther options used with 'help', ignoring and exiting!")
			os.Exit(0)
		}
	}

	if doBuild {
		build()
		fmt.Println("Site built successfully")
	}

	if includeTSFiles && !doBuild {
		fmt.Println("\n'inclts' option used without 'build', ignoring")
	}

	if doServe {
		serve()

	}
}

func check(err error) {
	if err != nil {
		panic(err)
	}
}

// func writeMap[K comparable, V any](wr io.Writer, m map[K]V) {
// 	for key, value := range m {
// 		wr.Write(
// 			[]byte(fmt.Sprintf(
// 				"%s -> %s\n",
// 				fmt.Sprint(key),
// 				fmt.Sprint(value),
// 			)),
// 		)
// 	}
// }

// -- Build code --

type pageData struct {
	Title   string
	Sidebar string
	Main    string
}

type mainData struct {
	Content string
}

func build() {
	// Setup the temp docsNew temp directory
	check(os.RemoveAll("docsNew"))
	check(os.Mkdir("docsNew", 0755))

	copyRawPages("")
	copyTemplatedPages()

	// Move temp docsNew directory to docs directory
	check(os.RemoveAll("docs"))
	check(os.Rename("docsNew", "docs"))

	cmd := exec.Command("npx", "tsc")
	out := bytes.NewBuffer(nil)
	cmd.Stdout = out
	check(cmd.Run())
	if out.Len() != 0 {
		fmt.Println(out.String())
	}
}

func copyRawPages(subDir string) {
	// Read raw pages
	rawPages, err := os.ReadDir(path.Join("rawPages", subDir))
	check(err)

	// Loop over raw pages
	for _, rawPage := range rawPages {
		// If it is a directory, run this function over that too
		if rawPage.Type().IsDir() {
			err = os.Mkdir(path.Join("docsNew", subDir, rawPage.Name()), 0755)
			if err != nil && !errors.Is(err, os.ErrExist) {
				check(err)
			}

			copyRawPages(path.Join(subDir, rawPage.Name()))
			continue
		}

		if !includeTSFiles && strings.HasSuffix(rawPage.Name(), ".ts") {
			continue
		}

		// Copy the raw file to docs
		rawPageFile, err := os.ReadFile(path.Join("rawPages", subDir, rawPage.Name()))
		check(err)

		check(os.WriteFile(
			path.Join("docsNew", subDir, rawPage.Name()),
			rawPageFile,
			0644,
		))
	}
}

func copyTemplatedPages() {
	// Settings
	gohtml.Condense = true

	// Create templates
	tmpl := template.Must(template.New("template.html").ParseFiles("templates/template.html"))
	mainTmpl := template.Must(template.New("main.html").ParseFiles("components/main.html"))

	// Read templated page names
	tmplPageNamesFile, err := os.ReadFile("templatedPageNames.json")
	check(err)

	pageNames := map[string]string{}
	json.Unmarshal(tmplPageNamesFile, &pageNames)

	// Read the sidebar component
	sidebarFile, err := os.ReadFile("components/sidebar.html")
	check(err)
	Sidebar := string(sidebarFile)

	copyTemplatedDir("", *mainTmpl, *tmpl, pageNames, Sidebar)
}

func copyTemplatedDir(subDir string, mainTmpl template.Template, tmpl template.Template, pageNames map[string]string, Sidebar string) {
	// Read templated pages
	tmplPages, err := os.ReadDir(path.Join("templatedPages", subDir))
	check(err)

	// Loop over templated pages
	for _, tmplPage := range tmplPages {
		// If it is a directory, run this function over that too
		if tmplPage.Type().IsDir() {
			err = os.Mkdir(path.Join("docsNew", subDir, tmplPage.Name()), 0755)
			if err != nil && !errors.Is(err, os.ErrExist) {
				check(err)
			}

			copyTemplatedDir(path.Join(subDir, tmplPage.Name()), mainTmpl, tmpl, pageNames, Sidebar)
			continue
		}

		// Read file of content
		contentFile, err := os.ReadFile(path.Join("templatedPages", subDir, tmplPage.Name()))
		check(err)
		Content := string(contentFile)

		// Build main component
		mainData := mainData{
			Content,
		}

		mainBuf := bytes.NewBuffer(nil)
		check(mainTmpl.Execute(mainBuf, mainData))
		Main := mainBuf.String()

		// Get title of page
		Title := pageNames[tmplPage.Name()]
		if len(Title) == 0 {
			Title = pageNames["default"]
		}

		// Build page and re-format
		data := pageData{
			Title,
			Sidebar,
			Main,
		}

		pageBuf := bytes.NewBuffer(nil)
		pageWriter := gohtml.NewWriter(pageBuf)
		check(tmpl.Execute(pageWriter, data))

		// Write page to docs
		check(os.WriteFile(
			path.Join("docsNew", subDir, tmplPage.Name()),
			pageBuf.Bytes(),
			0644,
		))
	}
}

// -- Server code --

func serve() {
	fmt.Println("This server should only be used as a test server!")

	// Create static file server on docs
	mux := http.NewServeMux()

	dir := http.Dir("docs")
	fs := http.FileServer(dir)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Check for 404 and append '.html' if 404 then serve
		buf := httptest.NewRecorder()
		fs.ServeHTTP(buf, r)
		if buf.Result().StatusCode == 404 {
			r.URL.Path += ".html"
			fs.ServeHTTP(w, r)
		} else {
			fs.ServeHTTP(w, r)
		}
	})

	fmt.Println("Hosting on localhost:8080")

	check(http.ListenAndServe(":8080", mux))
}
