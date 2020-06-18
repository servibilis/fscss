# FSCSS
Allows you to save changes to css styles in Developer Tools to a remote server as scss.

After making changes to Styles in element.style or in the properties of classes (only those that are in the file we are working with) by pressing F6 (by default) or the save button, the styles are saved.

## Demo (example)
Here's the [demo](https://servibilis.github.io/fscss/example/index.html).

## progressive enhancement / graceful degradation
The value of the properties can be specified in the form:
```scss
	font-size:10px|12px|14px|16px|18px
	font-size:10px|||16px|18px
```
and will be converted to:
```scss
	@include fscssprop(font-size,10px,12px,14px,16px,18px);
	@include fscssprop(font-size,10px,null,null,16px,18px);
```
The mixin code that is generated for the specified grid:
```scss
	@mixin fscssprop($name,$def,$p576:null,$p768:null,$p992:null,$p1200:null){
		#{$name}:#{$def};
		@if $p576!=null {
			@media (min-width:576px){
				#{$name}:#{$p576};
				}
			}
		@if $p768!=null {
			@media (min-width:768px){
				#{$name}:#{$p768};
				}
			}
		@if $p992!=null {
			@media (min-width:992px){
				#{$name}:#{$p992};
				}
			}
		@if $p1200!=null {
			@media (min-width:1200px){
				#{$name}:#{$p1200};
				}
			}
		}
```
The default size grid is 576,768,992,1200, but it can be overridden during initialization.

## save as scss tree
For control of the depth of attachments of selectors and the view of selectors introduced css properties:
```
--add_tag : 0||1||2||..   // add a tag name to the selector, processed if value > 0
--stop : 0||1||2||..      // stop creating a selector on this tag, processed if value > 0
--skip : 0||1||2||..      // skip this tag in selector creation, processed if value > 0
--to_root : 0||1||2||..   // skip from the current tag all tags in the selector creation to the first --stop or body found, processed if value > 0
--prefix :"string"        // add prefix to selector
--suffix :"string"        // add suffix to selector
```
For example, let's say we will work with such a DOM tree
```html
<body class="page">
	<div class="c1">
		<div>
			<div class="c2">
				<div class="c3">

				</div>
			</div>
		</div>
	</div>
</body>
```
If we specify styles for .c3, then the sass tree will look like
```scss
.page{
	.c1{
		.c2{
			.c3{
				some:style;
				}
			}
		}
	}
```
if .c3 has --stop:1
```scss
.c3{
	--stop:1;
	some:style;
	}
```
if --stop:1 at .c2
```scss
.c2{
	--stop=1
	.c3{
		some:style;
		}
	}
```
if --skip:1 at .c1
```scss
.page{
	.c1{
		--skip:1;
		}
	.c2{
		.c3{
			some:style;
			}
		}
	}
```
if --to_root:1 have .c3
```scss
.page{
	.c3{
		--to_root:1;
		some:style;
		}
	}
```
if --to_root:1 at .c2
```scss
.page{
	.c2{
		--to_root:1;
		.c3{
			some:style;
			}
		}
	}
```
if --add_tag:1 for .c3 and .c1
```scss
.page{
	div.c1{
		--add_tag:1;
		.c2{
			div.c3{
				some:style;
				--add_tag:1;
				}
			}
		}
	}
```
if --prefix: 'xxxx' for .c3
```scss
.page{
	.c1{
		.c2{
			xxxx.c3{
				some:style;
				--prefix : 'xxxx';
				}
			}
		}
	}
```
if --suffix: 'xxxx' for .c3
```scss
.page{
	.c1{
		.c2{
			.c3xxxx{
				some:style;
				--suffix : 'xxxx'
				}
			}
		}
	}
```
Styles are saved only from the style attribute or changes to classes that are contained in the styles file we are working with.

Since in css properties of the form --prop are inherited, and in order to make them non-inheritable, only those values that differ from the values of this property for the parent nodes are processed.

if --add_tag:1 for .c2 and .c1
```scss
.page{
	div.c1{
		--add_tag:1;
		.c2{
			--add_tag:1;
			div.c3{
				some:style;
				}
			}
		}
	}
```
for everything to work, you need to specify a .c2 value for --add_tag distinct from .c1, for example 2
```scss
.page{
	div.c1{
		--add_tag:1;
		div.c2{
			--add_tag:2;
			div.c3{
				some:style;
				}
			}
		}
	}
```
## how to use
Here is an example code and [demo page](https://servibilis.github.io/fscss/example/index.html).
```javascript
<script src="../dist/fscss.js"></script>
<script>
	let sass = new Sass(); // для компиляции sass в браузере
	let style = document.createElement("style");
	document.head.appendChild(style);
	// initiation
	let f = new fscss({
		// classes that will not be used when creating the selector
		array_class_exclude:['row','col-sm','p-1','m-3'],
		// grid for progressive enhancement / graceful degradation
		progressive_sizes:[576,992,1200],
		// button to save
		key_save_css:'F5',
		// show button to save on page
		show_save_button:true,
		// function that should return fscss code from somewhere
		get_fscss:()=>document.querySelector(".fscss").innerText,
		// handler to which fscss code is sent
		set_fscss:(fscss)=>{
			// in this function you need to save the fscss code somewhere
			document.querySelector(".fscss").innerText = fscss;
			},
			// the handler to which the scss code is sent
		set_scss:(scss)=>{
			// in this function, you need to save the scss code somewhere
			document.querySelector(".scss").innerText = scss;
			// in the example, css code is compiled immediately and the stylesheet is updated
			sass.compile(scss, function(result) {
				document.querySelector(".css").innerText = result.text;
				style.innerText = result.text;
				});
			document.querySelectorAll("*").forEach((e)=>{
				e.removeAttribute('style');
				e.dataset.mutation=0;
				});
			}
		}
		);
	f.save();
</script>
```


