<?php

/**
* Plugin Name: DEV
* Plugin URI: indi.site
* Description: dev
* Version: 1.0.0
* Author: Andrii Kulyk
* Author URI: http://indi.site
*/

add_action("wp_enqueue_scripts", "dev_js_script");
function dev_js_script() {
	if(!is_admin()){
		wp_register_script('dev',plugin_dir_url(__FILE__).'dev.js', array ('jquery'),false,false);
		wp_enqueue_script('dev');
		}
	}

add_action( 'init', 'wpse9870_init_internal' );
function wpse9870_init_internal(){
	add_rewrite_rule( 'dev$', 'index.php?dev=1', 'top' );
	}

add_filter( 'query_vars', 'wpse9870_query_vars' );
function wpse9870_query_vars($query_vars){
	$query_vars[] = 'dev';
	return $query_vars;
	}

add_action( 'parse_request', 'wpse9870_parse_request' );
function wpse9870_parse_request(&$wp){
	if(array_key_exists('dev',$wp->query_vars)===true&&$wp->query_vars['dev']==='scss'){
		if(is_dir(get_template_directory()."/scss")===false){
			mkdir(get_template_directory()."/scss",0777);
			}
		if(is_dir(get_template_directory()."/scss/cache")===false){
			mkdir(get_template_directory()."/scss/cache",0777);
			}

		$scss = get_template_directory()."/scss/style.scss";
		$dir_cache = get_template_directory()."/scss/cache";

		if(isset($_POST['action'])===true){
			if($_POST['action']=='get'){
				$content=str_replace(PHP_EOL, '', file_get_contents($scss));
				$content=str_replace('	', '', $content);
				echo $content;	
				}
			else if($_POST['action']=='set'&&isset($_POST['content'])===true&&($content=trim($_POST['content']))!=""){
				$nname = $dir_cache."/".time();
				$handle = fopen($nname, "w");
				fwrite($handle,file_get_contents($scss));
				fclose($handle);
				$content =	stripcslashes($content);
				echo file_put_contents($scss,fn_get_beuty_code($content))!==FALSE?1:0;
				fn_set_scss($content);
				exec('/usr/bin/gulp --gulpfile=/var/www/nodejs/zt/gulpfile.js cars');
				}
			}
		exit();
		}
	return;
	}


function fn_get_beuty_code($content){
	$nwcontent = "";
	$cnt =0;
	$content = str_replace(PHP_EOL, '', $content);
	$content = str_replace('	', '', $content);
	$l = mb_strlen($content);
	for($i=0;$i<$l;$i++){
		$ltr = $content[$i];
		if($ltr=="{"){
			$cnt+=1;
			}
		if($ltr=="}"){
			$cnt-=1;
			}
		if($ltr=="{"||$ltr==";"||$ltr=="}"){
			$ltr.="
";
			for($j=0;$j<$cnt;$j++){
				$ltr.="	";
				}
			}
		$nwcontent.=$ltr;
		}
	return $nwcontent;
	}

function fn_set_scss($content){
	$scss_render = get_template_directory()."/scss/code.scss";
	preg_match_all("/((?!;|{).)*:((?!;|{).)*\|((?!;|{).)*(?=;|{)/",$content,$matches,PREG_OFFSET_CAPTURE);
	if(isset($matches[0])===true&&is_array($matches[0])===true ){
		foreach($matches[0] as $r){
			$str = $r[0];
			$pos = $r[1];
			$len = mb_strlen($str);
			$ar1 = explode(":",$str);
			if(count($ar1)==2){
				$ar2 = explode("|",$ar1[1]);
				if(count($ar2)>1){
					// if(count($ar2)==2){
					//     $ar2[2] = $ar2[1];
					//     $ar2[1] = 'null';
					//     }
					//

					$ar2[0]=isset($ar2[0])===true&&trim($ar2[0])!=""?trim($ar2[0]):'null';
					$ar2[1]=isset($ar2[1])===true&&trim($ar2[1])!=""?trim($ar2[1]):'null';
					$ar2[2]=isset($ar2[2])===true&&trim($ar2[2])!=""?trim($ar2[2]):'null';
					$ar2[3]=isset($ar2[3])===true&&trim($ar2[3])!=""?trim($ar2[3]):'null';

					$pname = $ar1[0];
					$p1 = $ar2[0];
					$p2 = $ar2[1];
					$p3 = isset($ar2[2])===true?$ar2[2]:'null';
					$p4 = isset($ar2[3])===true?$ar2[3]:'null';
					$nwparam = "@include preprop(".$pname.",".$p1.",".$p2.",".$p3.",".$p4.")";
					$content  = str_replace($str,$nwparam,$content);
					}
				}
			}
		}

	//create beuty code	
	$content = fn_get_beuty_code($content);
	$content = "@mixin preprop(\$name,\$def,\$p768:null,\$p992:null,\$p1200:null){
	#{\$name}:#{\$def};
	@if \$p768!=null {
		@media (min-width:768px){
			#{\$name}:#{\$p768};
			}
		}
	@if \$p992!=null {
		@media (min-width:992px){
			#{\$name}:#{\$p992};
			}
		}
	@if \$p1200!=null{
		@media (min-width:1200px){
			#{\$name}:#{\$p1200};
			}
		}
	}
	".$content;

	$content =	htmlspecialchars_decode($content, ENT_QUOTES);
	$handle = fopen($scss_render, "w");
	fwrite($handle,$content);
	fclose($handle);


	}

?>
