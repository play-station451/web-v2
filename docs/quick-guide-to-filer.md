# <span style="color: #32ae62;">Quick Guide To Filer</span>
This simple guide will give you some basic Filer usages and how we at Terbium believe you should write your Filer code; asynchronously.<br>
> For more a depth guide refer to the [<span style="color: #32ae62;">Filer GitHub</span>](https://github.com/filerjs/filer)

If your want to use Filer in your app put this in the head
```html
<script src="/assets/libs/filer.min.js"></script>
```
For starters when you are reading a file or directory you should use the **promises** version of that action, below is a visual example:

```js
// Bad
await Filer.fs.readFile("/hi/hi.txt", "utf8", (err, data) => {
    if(err) throw err
    console.log(data)
})

// Good
let hi = await Filer.fs.promises.readFile("/hi/hi.txt", "utf8")
console.log(hi)
```

## <span style="color: #32ae62;">Contents</span>
- [fs.mkdir](#mkdir)
- [fs.writeFile](#writeFile)
- [fs.readFile](#readFile)
- [fs.readdir](#readdir)
- [fs.rmdir](#rmdir)
- [fs.unlink](#unlink)

### <a id="mkdir">fs.mkdir(path, [options], callback)</a>
Makes a directory from the `path` argument
```js
await Filer.fs.promises.mkdir("/hi");
```
### <a id="writeFile">fs.writeFile(path, data, [options], callback)</a>
Writes to a file can be any, can be a `string` or `buffer`
> <span style="color: #ffd900;"><span style="font-family: none;">⚠</span> NOTE:</span> If you trying to write something like a image you should turn the data of the image into an array buffer
```js
// UTF8 text file
await Filer.fs.promises.writeFile("/hi/hi.txt", "Hiiiii");

// Example of uploading raw image binary buffer
let imgData = e.target.files[0].arrayBuffer();
await Filer.fs.promises.writeFile("spungerbog.png", Filer.Buffer.from(imgData));
```
### <a id="readFile">fs.readFile(path, [options], callback)</a>
Reads a file, options can be it's encoding `"utf8"` or an object literal `{ encoding: "utf8" }`<br>
> <span style="color: #ffd900;"><span style="font-family: none;">⚠</span> NOTE:</span> if encoding is not passed in options it will output the raw binary buffer
```js
let hi = JSON.parse(await Filer.fs.promises.readFile("/hi/hi.txt", "utf8"));
// hi is now the contents of hi.txt as a UTF8 String
```
### <a id="readdir">fs.readdir(path, [options], callback)</a>
Example directory structure:
```js
/*
* /hi
*  | hi.txt
*/
```
```js
let dir = await Filer.fs.promises.readdir("/hi");
// dir is now an array of it's contents ["hi.txt"]
```
### <a>fs.rmdir(path, callback)</a>
Removes a directory if it is empty.
```js
// remove an empty dir
await Filer.fs.promises.rmdir("/hi/empty-dir");
```
> <span style="color: #ffd900;"><span style="font-family: none;">⚠</span> NOTE:</span> If you would like to forcefully and recursively remove a dir look the below code
```js
await (new Filer.fs.Shell()).promises.rm("/hi", {recursive: true})
```
### <a name="unlink">fs.unlink(path, callback)</a>
Remove a file provided from path argument
```js
await Filer.fs.promises.unlink("/hi/hi.txt")
```