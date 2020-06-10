
import * as parser from "./scss_parser.js"

/**
 * save css styles from DevTools
 */
export class fscss{

	/**
	 * get new css props after mutation
	 */
	static get_css_properties_for_element(element){
		let copystyle = typeof(element.dataset.copystyle)!="undefined"?parser.trim(element.dataset.copystyle):false;
		let style = element.getAttribute('style');
		if(style!=null){
			style = parser.scss_to_array(parser.trim(style));
			if(typeof(style['style'])!="undefined"){
				style = style['style'];
				}
			}
		if(Object.keys(style).length>0 && copystyle!=false && copystyle!="" ){
			let aout = {};
			copystyle = parser.scss_to_array(parser.trim(copystyle));
			if(typeof(copystyle['style'])!="undefined"){
				copystyle = copystyle['style'];
				for(let key in style){
					if(typeof(copystyle[key])=='undefined'||style[key]!=copystyle[key]){
						aout[key] = style[key];
						}
					}
				}
			return aout;
			}
		return style;
		}
	/**
	 * create array for create element selector, work recursive 
	 */
	static getSelectorForElement(e,prevsel=[],recursive=true,to_root=false){
		if(to_root==false&&prevsel.length==0&&typeof(e.dataset.to_root)!='undefined'){
			to_root=parseInt(e.dataset.to_root)==1;
			}
		let tagName = e.tagName.toLowerCase();
		let stop = typeof(e.dataset.stop)!='undefined'?parseInt(e.dataset.stop)==1:false;

		if(recursive===true&&prevsel.length!=0){
			let skip = typeof(e.dataset.skip)!='undefined'?parseInt(e.dataset.skip)==1:false;
			if(skip===true||(to_root===true&&stop===false)){
				return fscss.getSelectorForElement(e.parentElement,prevsel,recursive,to_root);
				}
			}

		if(tagName=='body'){
			stop=true;
			}

		// let hover = e.parentElement.querySelector(':hover') === e;
		// let active = e.parentElement.querySelector(':active') === e;
		// let focus = e.parentElement.querySelector(':focus') === e;
		// let visited = e.parentElement.querySelector(':visited') === e;

		let prefix =typeof(e.dataset.prefix)!='undefined'?e.dataset.prefix.trim():false;
		let suffix =typeof(e.dataset.suffix)!='undefined'?e.dataset.suffix.trim():false;
		let add_tag = typeof(e.dataset.add_tag)!='undefined'?parseInt(e.dataset.add_tag)==1:false;
		let selector = add_tag===true?tagName:"";
		let id = e.id.trim();
		if(id!=""){
			selector+="#"+id;
			}
		let cl = e.className.toLowerCase().trim();
		if(cl!=""){
			selector+="."+cl.replace(/\s+/g,".");
			}
		if(selector===""){
			selector=tagName;
			}
		if(prefix!==false){
			prefix = prefix.replace(/\s*['||"]\s*$/,"");
			prefix = prefix.replace(/^\s*['||"]\s*          /,"");
			selector = prefix+selector;
			}
		if(suffix!==false){
			suffix = suffix.replace(/\s*['||"]\s*$/,"");
			suffix = suffix.replace(/^\s*['||"]\s*                /,"");
			selector = selector+suffix;
			}

		prevsel.unshift(selector);
		if(recursive===true && stop===false){
			return fscss.getSelectorForElement(e.parentElement,prevsel,recursive,to_root);
			}
		return prevsel;
		}





















	/**
	 * create instance for fscss
	 * @param fn_get_fscss - get code fscss
	 * @param fn_set_fscss - function for save fscss
	 * @param fn_set_scss -  function for save scss
	 * @param show_save_button=false - show button with click run fn_set_fscss && fn_set_scss
	 * @param key_save_css='F6' - button with key press run fn_set_fscss && fn_set_scss
	 * @param array_class_exclude={}
	 * @param progressive_sizes=[576,768,992,1200] - we can set style like - font-size : 14px|16px|18px|20px|24px
	 */
	constructor(fn_get_fscss,
		fn_set_fscss,
		fn_set_scss=false,
		front_end_side = true,
		show_save_button=true,
		key_save_css='F6',
		array_class_exclude={},
		progressive_sizes=[576,768,992,1200],
		){
		this.front_end_side = front_end_side;
		this.controll_words = ['add_tag','stop','skip','to_root','prefix','suffix'];
		// check fn_get_fscss
		if((fn_get_fscss instanceof Function)===false){
			throw "fn_get_fscss is not function";
			}
		else{
			this.get = fn_get_fscss;
			}
		//check fn_set_fscss
		if((fn_set_fscss instanceof Function)===false ){
			throw "fn_set_fscss is not function";
			}
		else{
			this.set_fscss = fn_set_fscss;
			}
		//check fn_set_scss, not required
		this.set_scss = false;
		if((fn_set_scss instanceof Function)===true ){
			this.set_scss = fn_set_scss;
			}

		// save && set another params
		this.key_save_css = key_save_css.toLowerCase();
		this.array_class_exclude = array_class_exclude;
		this.progressive_sizes = progressive_sizes;
		this.button = show_save_button===true;
		this.obj_mutations = []; // DOM nodes which have mutations
		this.fname = Array.isArray(this.progressive_sizes)===true?"fscssprop":false;

		if(this.front_end_side===true){
			// init virtual styleSheets
			this.init_styleSheets();
			//init button
			if(this.button===true){
				this.init_button();
				}
			//action keyup
			document.addEventListener('keyup',e => {
				if(e.key.toLowerCase()==this.key_save_css){
					this.save();
					}
				});
			//save old attribute style
			let elmnts = document.querySelectorAll('body,body *');
			for(let ei=0;ei<elmnts.length;ei++){
				if( typeof(elmnts[ei].attributes.style)!="undefined" ){
					elmnts[ei].dataset.copystyle = elmnts[ei].getAttribute('style');
					}
				}
			//mutations
			let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
			this.dev_observer = new MutationObserver((mutations)=>{
				mutations.forEach((mutation)=>{
					if(mutation.attributeName=="style"){
						mutation.target.dataset.mutation=1;
						if(this.button==true){
							document.getElementById('dev_save').className="show";
							}
						if(this.obj_mutations.indexOf(mutation.target)<0){
							this.obj_mutations[this.obj_mutations.length] = mutation.target;
							}
						}
					});
				});
			this.dev_observer.observe(document.body, {subtree: true, childList: true, attributes: true, attributeOldValue: true,attributeFilter: ["style"] });
			}
		}
	/**
	 * create button for save changes
	 */
	init_button(){
		let style = document.createElement("style");
		document.head.appendChild(style);
		style.sheet.insertRule("#dev_save{display:none;font-family: sans-serif;opacity:0.8;position:fixed;bottom:20px;right:20px;color:#fff;font-size:14px;line-height:2;background-color:#434343;padding:0px 15px}", 0);
		style.sheet.insertRule("#dev_save.show{display:block;}", 0);
		style.sheet.insertRule("#dev_save::before{content:'save';}", 0);
		style.sheet.insertRule("#dev_save:hover{cursor:pointer;;background-color:#000;transition:background-color 0.5s;}",0);
		let btn = document.createElement("div");
		btn.id = "dev_save";
		document.body.appendChild(btn);
		btn.addEventListener("click",()=>{
			if(confirm("save?")){
				this.save();
				}
			});
		}
	/**
	 * load original css text for styleSheets and init virtual sheets with control words
	 */
	init_styleSheets(){
		this._styleSheets = [];
		for(let i=0;i<document.styleSheets.length;i++){
			let sheet = document.styleSheets[i];
			let original_txt = "";
			if( sheet.ownerNode.tagName.toLowerCase()=='style' ){
				original_txt = sheet.ownerNode.innerText;
				}
			else if(sheet.ownerNode.tagName.toLowerCase()=='link'){
				original_txt = fscss.getText(sheet.ownerNode.href);
				}
			if(original_txt!=""){
				this._styleSheets.push(parser.scss_to_array(original_txt));
				}
			}
		this.initDataControllwords();
		}
	/**
	 * load file
	 */
	static getText(href,fn){
		let request = new XMLHttpRequest();
		request.open('GET', href, false);
		request.send(null);
		if (request.status === 200) {
			return request.responseText;
			}
		return "";
		}
	/**
	 * create scss text from array
	 */
	array_to_css(arr,setprop=false,tabs="\n",tab="\t"){
		let str = "";
		if( typeof arr['style']!="undefined" ){
			for(let a in arr['style']){
				if(this.fname===false||setprop===false){
					str+=tabs+(arr['style'][a]!=""?a+":"+arr['style'][a]:a)+";";
					}
				else{
					str+=tabs+this.set_css_prop(a,arr['style'][a])+";";
					}
				}
			}
		if( typeof arr['child']!="undefined" ){
			for(let a in arr['child']){
				str += tabs+a+"{"+(typeof arr['child'][a]=='string'?arr['child'][a]:this.array_to_css(arr['child'][a],setprop,tabs+tab))+tabs+tab+"}";
				}
			}
		str = str.replace(/};+/g,"}");
		str = str.replace(/{;+/g,"{");
		str = str.replace(/;+/g,";");
		return str;
		}
	/**
	 * init for all selectors from virtual sheets control words
	 */
	initDataControllwords(){
		if(this.controll_words.length>0){
			for(let i=0;i<this._styleSheets.length;i++){
				this.initDataControllwords_forsheet(false,this._styleSheets[i]);
				}
			}
		}
	initDataControllwords_forsheet(sel,sheet,style){
		if(Object.keys(sheet['style']).length>0 && sel!==false){
			this.controll_words.map((word)=>{
				if(typeof sheet['style'][word]!=='undefined'){
					let tmparr = document.querySelectorAll(sel);
					if(tmparr.length>0){
						for(let j=0;j<tmparr.length;j++){
							tmparr[j].dataset[word] = sheet['style'][word];
							let attrstyle = tmparr[j].getAttribute('style');
							attrstyle = attrstyle===null?"":attrstyle;
							if(attrstyle!=""){
								attrstyle = attrstyle.trim();
								if(attrstyle[attrstyle.length-1]!=";"){
									attrstyle += ";";
									}
								attrstyle = parser.scss_to_array(attrstyle);
								}
							attrstyle.style[word] = sheet['style'][word];
							tmparr[j].setAttribute('style',this.array_to_css(attrstyle).replace(/\n/g,""));
							}
						}
					}
				});
			}
		for(let selchild in sheet['child']){
			this.initDataControllwords_forsheet(selchild,sheet['child'][selchild]);
			}
		}
	/**
	 * create css prop 
	 */
	set_css_prop(name,param){
		let l = param.length;
		let separators = [];
		let start_skip_symbol = false;
		let skip = false;
		for(let i=0;i<l;i++){
			let ltr = param[i];
			if(skip===true){
				skip=start_skip_symbol!=ltr;
				if(skip===false){
					start_skip_symbol = false;
					}
				continue;
				}
			else{
				skip=ltr=="'"||ltr=='"';
					if(skip===false && ltr=="|"){
						separators.push(i);
						}
				else{
					start_skip_symbol=ltr;
					continue;
					}
				}
			}
		if(separators.length>0){
			let params=[];
			let prev_pos = 0;
			for(let j=0;j<separators.length;j++){
				let tmp = param.substring(prev_pos,separators[j]);
				params.push(tmp!=""?tmp:"null");
				prev_pos = separators[j]+1;
				}
			params.push(param.substring(prev_pos));
			return "@include "+this.fname+"("+name+","+params.join(",")+")";
			}
		return (param!=""?name+":"+param:name);
		}
	/**
	 * apply all mutations
	 */
	applyMutations(oldStyles,w=0){
		if(typeof oldStyles=='undefined'){
			oldStyles = {'child':{},'style':{}};
			}
		for(let i=0;i<this.obj_mutations.length;i++){
			let obj = this.obj_mutations[i];
			if(parseInt(obj.dataset.mutation)===1){
				let selector = fscss.getSelectorForElement(obj);
				let styles = fscss.get_css_properties_for_element(obj);
				let l = selector.length;
				if(Object.keys(styles).length>0 && l>0){
					let tmp = oldStyles;
					for(let i=0;i<l;i++){
						let sel = selector[i];
						if(typeof tmp['child'][sel]=='undefined'){
							tmp['child'][sel] = {'child':{},'style':{}};
							}
						tmp=tmp['child'][sel];
						}
					tmp = parser.merge(tmp,{'child':{},'style':styles});
					}
				}
			}
		}
	/**
	 * add scss function for progressive enhancement
	 */
	include_propfn_scss(){
		let fntxt = "";
		if(this.progressive_sizes.length>0){
			fntxt = "@mixin "+this.fname+"($name,$def";
			let body = "#{$name}:#{$def};";
			for(let j=0;j<this.progressive_sizes.length;j++){
				let sz = this.progressive_sizes[j];
				fntxt+=",$p"+sz+":null";
				body+=" @if $p"+sz+"!=null { @media (min-width:"+sz+"px){ #{\$name}:#{\$p"+sz+"}; } } "
				}
			fntxt+="){ "+body+" }";
			}
		return fntxt;
		}
	/**
	 * run save all - fscss - scss
	 */
	save(){
		let new_fscss = parser.scss_to_array(this.get());
		if(this.front_end_side===true){
			this.applyMutations(new_fscss);
			this.set_fscss(this.array_to_css(new_fscss,false));
			}
		this.save_scss(new_fscss);
		}
	/**
	 * save scss
	 */
	save_scss(new_fscss){
		if(this.set_scss!==false){
			let new_scss = this.array_to_css(new_fscss,true);
			if(this.fname!==false){
				new_scss = this.include_propfn_scss() + "\n" + new_scss;
				}
			this.set_scss(new_scss);
			}
		}
	}
