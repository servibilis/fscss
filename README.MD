# FSCSS
save CSS changes of Styles panel of Google Chrome Developer Tools



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

For an element with class c2 the final tree of the scss will be
	.page{
		.c1{
			.c2{
				.c3{

					}
				}
			}
		}

stop - will stop on the current item when creating the selector
if in .c3 stop=1
	.c3{

	}
or if .c2 stop=1
.c2{
	.c3{

		}
	}

skip - skip current element
if .c1 skip=1
.page{
	.c2{
		.c3{

			}
		}
	}

to_root - skips all parent selectors to the first stop or body
if .c3 to_root=1
.page{
	.c3{

		}
	}

add_tag - add tabname in selector
if .c3  add_tag=1
.page{
	.c1{
		.c2{
			div.c3{

				}
			}
		}
	}

prefix - add the set value as a prefix to the selector
if .c3 prefix : 'xxxx'
.page{
	.c1{
		.c2{
			xxxx.c3{
				}
			}
		}
	}

suffix - add the set value as a suffix to the selector
if .c3 suffix : 'xxxx'
.page{
	.c1{
		.c2{
			xxxx.c3{
				}
			}
		}
	}
