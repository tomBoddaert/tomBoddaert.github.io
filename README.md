![My Logo](public/resources/profile-image.svg)

# [tomBoddaert.com](https://tomBoddaert.com/)

This is my personal website, built in [Astro](https://astro.build/).

## Building

First install [deno](https://deno.com/), then the dependencies:

```sh
deno install
```

The first time you build it, you'll need to sync Astro's generated types:

```sh
deno x astro sync
```

To run the dev server:

```sh
deno task dev [--open]
```

To check the code:

```sh
deno task tsc-check
```

If you want to check the production build (projects currently broken):

```sh
deno task preview
```

## Licensing

This project is not licensed, all rights are reserved.
