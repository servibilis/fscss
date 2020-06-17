# FSCSS
save CSS changes of Styles panel of Google Chrome Developer Tools
Позволяет сохранить внесенные изменения в css стили в devtools на удаленный сервер в виде scss.

После внесения изменений в Styles в element.style или в свойствах классов ( только те которые имеются в файле с которым работаем ) по нажатию на F6 ( по умолчанию ) или кнопки save происходит сохранение стилей.

## Demo (example)
Here's the [demo](https://servibilis.github.io/fscss/example/index.html).


## progressive enhancement / graceful degradation
Значение свойств  можно указывать в виде :
```scss
	font-size:10px|12px|14px|16px|18px
	font-size:10px|||16px|18px
```
что будет преобразовано в
```scss
	@include fscssprop(font-size,10px,12px,14px,16px,18px);
	@include fscssprop(font-size,10px,null,null,16px,18px);
```

Код миксины fscssprop, она генерируется под указанную размерную сетку
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
Размерная сетка по умолчанию 576,768,992,1200, но ее можно переопределить во время инициализации.

## сохранение в виде дерева scss
Управление глубиной вложений селекторов и видом самих селекторов введены css свойства

Введены вот такие сойства
```
--add_tag : 0||1||2||..  //добавить в селектор имя тега
--stop : 0||1||2||.. // остановить создание селектора на данном теге
--skip : 0||1||2||.. // пропустить данный тег в создание конечного селектора
--to_root : 0||1||2||.. //пропустить с текущего тега все теги в создании селектора, до первого найденного --stop или body
--prefix :"string"//добавить в селектор префикс
--suffix :"string" //добавить в селектор суффикс
```

Например, допустим мы будем работать с вот таким DOM-деревом
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

Если мы укажем стили для .c3, то дерево будет иметь вид
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

если у .c3 будет указан --stop=1
```scss
.c3{
	--stop:1;
	some:style;
	}
```

если стили у .c3, --stop:1 у .c2
```scss
.c2{
	--stop=1
	.c3{
		some:style;
		}
	}
```

если стили у .c3, --skip:1 у .c1
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

если стили у .c3, --to_root:1 у .c3
```scss
.page{
	.c3{
		--to_root:1;
		some:style;
		}
	}
```

если стили у .c3, --to_root:1 у .c2
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

если стили у .c3, --add_tag:1 у .c3 и у .c1
```scss
.page{
	div.c1{
		.c2{
			div.c3{
				some:style;
				--add_tag:1;
				}
			}
		}
	}
```

если стили у .c3, --prefix : 'xxxx' у .c3
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

если стили у .c3, --suffix : 'xxxx' у .c3

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

Сохраняются стили только из атрибута style или изменения у классов которые содержатся в файле стилей с которым работем.

Так как в css свойства вида --prop наследуются, и чтобы сделать их не наследуемые, отрабатываются только те значения которые отличаются от значений данного свойства у родительских нод.

# how to use

Вот код примера
```javascript
<script src="../dist/fscss.js"></script>
<script>
	let sass = new Sass(); // для компиляции sass в браузере
	let style = document.createElement("style");
	document.head.appendChild(style);
	// инициация
	let f = new fscss({
		array_class_exclude:['row','col-sm','p-1','m-3'], // классы которые будут пропускаться при создании селектора
		progressive_sizes:[576,992,1200], // сетка для progressive enhancement / graceful degradation
		key_save_css:'F5', // кнопка для кохранения
		show_save_button:true, // показывать кнопку для сохранения

		get_fscss:()=>document.querySelector(".fscss").innerText, // функция которая будет возвращать откудато код fscss
		set_fscss:(fscss)=>{ // обработчик в который отправляется код fscss
			// в данной функции вам необходмо куда-то сохранить код fscss 
			document.querySelector(".fscss").innerText = fscss;
			},
		set_scss:(scss)=>{ // обработчик в который отправляется код scss
			// в данной функции нужно сохранить куда-то код scss
			document.querySelector(".scss").innerText = scss;
			// в примере также тут сразу компилируется код css и обновляется таблица стилей
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


