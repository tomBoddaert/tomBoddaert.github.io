![My Logo](rawPages/resources/profile-image.svg)
# [tomBoddaert.github.io](https://tomBoddaert.github.io/)

This is my personal website

It uses a purpose made site builder, written in go: [site](https://github.com/tomboddaert/site).

## Building

First install [go](https://go.dev/)

To install the builder and TypeScript transpiler:
``` sh
go install github.com/tomboddaert/site@latest
npm i --omit=dev
```

To build the site:
``` sh
site build fmthml
```

To host the site (testing only):
``` sh
site serve
```

## Licensing

This project is unlicensed, but the site builder is licensed [here](https://github.com/tomboddaert/site#license).
