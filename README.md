# Document Viewer Instruction

A platform for viewing `markdown` document.

## Description

Here is a platform for viewing documents which is written in markdown format. You can just put documents under the document root path or its sub path, others can view it in this site.

Use Remarkable for parsing markdownfile: [https://github.com/jonschlinkert/remarkable.git](https://github.com/jonschlinkert/remarkable.git)

## Host

### Install

```
npm install
```

### Run
You can run like this easily, the document root path is default to `example` and the port is default to 3000:

```
node app.js
```

you can specify your document root path and the port you want to monitor

```
node app.js D:\docs -p 8080
```