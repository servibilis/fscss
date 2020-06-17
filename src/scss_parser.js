/**
 * trim input text from spaces, new lines, comments
 */
export function trim(sel){
	sel = sel.replace(/(?:\n|\r)+\/{2,}.*(?=\n)/g,'').trim(); //  remove comments - //
	sel = sel.replace(/(?:\n|\r)+/g,'').trim(); // remove \r\n
	let skip = false;
	let nsel = "";
	let l = sel.length;
	// remove comments - /* */
	for(let i=0;i<l;i++){
		if( skip==false && i+1<l && sel[i]=="/" && sel[i+1]=="*" ){
			skip = true;
			i+=1;
			continue;
			}
		else if( skip==true && i+1<l && sel[i]=="*" && sel[i+1]=="/" ){
			skip = false;
			i+=1;
			continue;
			}
		if(skip==false){
			nsel += sel[i];
			}
		}
	return nsel;
	}
/**
 * transform input scss text in array 
 * @param txt - text for parsing
 * @return dictionary {'child':{ child elements },'style':{ css styles for parent selector  }}
 */
export function scss_to_array(txt){
	let styles = {'child':{},'style':{}};
	let second_start = txt.indexOf('{'); // search start desc for this /scss_to_array
	// search ###{$$$} paterns, add first patter from start string
	let matches = [{'start':0,'second_start':second_start,'end':false}];
	if(second_start===-1){
		// if not found {
		matches[matches.length-1]['end'] = txt.length;
		}
	else{
		let cnt = 1;
		let l = txt.length;
		let start_skip_symbol = false; // the character with which the skip start
		let skip = false; // we skiping, whe search symbol "|' we skip betwen befor not found second "|'
		for(let i=second_start+1;i<l;i++){ // starting after first {
			let ltr = txt[i];
			// skip strings
			if(skip===true){
				skip=start_skip_symbol!=ltr;
				if(skip===false){
					start_skip_symbol = false;
					}
				continue;
				}
			else{
				skip=ltr=="'"||ltr=='"';
				if(skip===false){
					let ml=matches.length;
					if(ltr=="}"){
						cnt-=1; // decrease {}
						}
					else if(ltr=="{"){
						cnt+=1; // increase {}
						}
					// add new math only if all open { be closed }
					if(cnt==0){
						matches[ml-1]['end'] = i;
						let second_start = txt.indexOf('{',i);
						if(second_start==-1){
							break;
							}
						matches[ml] = {'start':i+1,'second_start':second_start,'end':false};
						cnt = 1;
						i = second_start+1;
						}
					}
				else{
					start_skip_symbol=ltr; // set symbol with wich start skiping
					continue;
					}
				}
			}
		}

	//explode matches to child elements and params
	for(let i=0;i<matches.length;i++){
		let itm = matches[i];
		let name = txt.substring(itm['start'],itm['end']);
		let body = "";
		// if we have body
		if(itm['second_start']>0){
			name = txt.substring(itm['start'],itm['second_start']);
			body = txt.substring(itm['second_start']+1,itm['end']);
			}
		//search position all ;
		let separators = [];
		let l = name.length;
		let start_skip_symbol = false;
		let skip = false;
		for(let j=0;j<l;j++){
			let ltr = name[j];
			if(skip===true){
				skip=start_skip_symbol!=ltr;
				if(skip===false){
					start_skip_symbol = false;
					}
				continue;
				}
			else{
				skip=ltr=="'"||ltr=='"';
				if(skip===false){
					if(ltr==";"){
						separators[separators.length]=j;
						}
					}
				else{
					start_skip_symbol=ltr;
					continue;
					}
				}
			}
		//explode to style params and name
		//example font-size:14px;.name{} - font-style in style - .name{} in child
		let sl = separators.length;
		let prev_pos = 0;
		for(let j=0;j<sl;j++){
			add_in_style(styles['style'],name.substring(prev_pos,separators[j]));
			prev_pos = separators[j]+1;
			}
		if(body.length>0){
			// search childs
			name = trim(name.substring(prev_pos,l));
			let arrchild = scss_to_array(body);
			// merge old and new styles
			styles['child'][name] = (name in styles['child'])===false?arrchild:merge(styles['child'][name],arrchild);
			}
		else{
			// if body like font-size:14px without ; and kids
			add_in_style(styles['style'],name.substring(prev_pos,l));
			}
		}
	return styles;
	}

function add_in_style(style,row){
	let tmp = row.split(':');
	if(tmp.length==2){
		tmp[0] = trim(tmp[0]);
		tmp[1] = trim(tmp[1]);
		}
	else{
		tmp[0] = trim(row);
		tmp[1] = "";
		}
	if(tmp[0]==""){
		return false;
		}
	style[tmp[0]]=tmp[1];
	return true;
	}

export function merge(oldarr,newarr){
	//params
	for(let paramname in newarr['style']){
		if(paramname==""){
			continue;
			}
		oldarr['style'][paramname] = newarr['style'][paramname];
		}
	//child
	for(let sel in newarr['child']){
		if((sel in oldarr['child'])===false){
			oldarr['child'][sel] = newarr['child'][sel];
			}
		else{
			oldarr['child'][sel] = merge(oldarr['child'][sel],newarr['child'][sel]);
			}
		}
	return oldarr;
	}

