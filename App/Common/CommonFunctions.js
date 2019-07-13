"use strict";



// -------- Setup --------

function GetCombinations(styleQuality) { //Same as in HandwritingGenerator
	var mainLetters = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
	var capitalLetters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
	var extraLetters = "ff,tt,ll";
	var discardedCombinations = "aa,bc,bf,bg,bh,bj,bk,bm,bn,bp,bq,btt,bv,bw,bx,bz,bff,btt,bll,cb,cd,cf,cg,cj,cm,cn,cp,cq,ctt,cv,cw,cx,cz,cff,ctt,cll,dc,dj,dk,dp,dq,dt,dtt,dx,dz,dff,dtt,dll,fb,fc,fd,fg,fh,fj,fk,fm,fn,fp,fq,ftt,fv,fw,fx,fz,fff,ftt,fll,gb,gc,gd,gf,gj,gk,gp,gq,gt,gtt,gv,gw,gx,gz,gff,gtt,gll,hc,hd,hf,hg,hh,hj,hk,hp,hq,htt,hv,hx,hz,hff,htt,hll,ij,iw,iy,jb,jc,jd,jf,jg,jh,jj,jk,jl,jm,jn,jp,jq,jr,js,jt,jtt,jv,jw,jx,jy,jz,jff,jtt,jll,kb,kc,kd,kf,kg,kj,kk,km,kp,kq,kt,ktt,kv,kx,kz,kff,ktt,kll,lh,lj,lq,lr,ltt,lw,lx,lz,lff,ltt,lll,mc,md,mf,mg,mh,mj,mk,mq,mr,mt,mtt,mv,mw,mx,mz,mff,mtt,mll,ntt,nx,nff,ntt,nll,oj,pb,pc,pd,pf,pg,pj,pk,pm,pq,ptt,pv,pw,px,pz,pff,ptt,pll,qa,qb,qc,qd,qe,qf,qg,qh,qi,qj,qk,ql,qm,qn,qo,qp,qq,qr,qs,qt,qtt,qv,qw,qx,qy,qz,qff,qtt,qll,rj,rq,rtt,rx,rz,rff,rtt,rll,sd,sg,sj,stt,sv,sx,sz,sff,stt,sll,td,tg,tj,tk,tq,ttt,tv,tx,tff,ttt,tll,ttb,ttc,ttd,ttf,ttg,tth,ttj,ttk,ttm,ttn,ttp,ttq,ttr,tts,ttt,tttt,ttu,ttv,ttw,ttx,tty,ttz,ttff,tttt,ttll,uh,uj,uq,uu,uw,uy,vb,vc,vd,vf,vg,vh,vj,vk,vl,vm,vn,vp,vq,vr,vs,vt,vtt,vv,vw,vx,vy,vz,vff,vtt,vll,wb,wc,wf,wg,wj,wk,wm,wp,wq,wt,wtt,wu,wv,ww,wx,wy,wz,wff,wtt,wll,xb,xd,xf,xg,xh,xj,xk,xl,xm,xn,xq,xr,xs,xtt,xv,xw,xx,xz,xff,xtt,xll,yf,yh,yj,yk,yq,ytt,yu,yv,yx,yy,yz,yff,ytt,zb,zc,zd,zf,zg,zh,zj,zk,zm,zn,zp,zq,zr,zs,zt,ztt,zu,zv,zw,zx,zff,ztt,zll,ffa,ffb,ffc,ffd,fff,ffg,ffh,ffj,ffk,ffm,ffn,ffo,ffp,ffq,ffr,ffs,fft,fftt,ffu,ffv,ffw,ffx,ffy,ffz,ffff,fftt,ffll,ttb,ttc,ttd,ttf,ttg,tth,ttj,ttk,ttm,ttn,ttp,ttq,ttr,tts,ttt,tttt,ttu,ttv,ttw,ttx,tty,ttz,ttff,tttt,ttll,llb,llc,lld,llf,llg,llh,llj,llk,lll,llm,lln,llp,llq,llr,llt,lltt,llv,llw,llx,llz,llff,lltt,llll";
	
	var main = mainLetters.split(",");
	var capitals = capitalLetters.split(",");
	var extras = extraLetters.split(",");
	
	var combined;
	if (styleQuality === "Best Quality" || styleQuality === "Quick Setup") { //If the extra letters should be included
		combined = main.concat(extras);
	} else {
		combined = main;
	}
	
	singleLettersCount = combined.length + capitals.length;
	lowercaseSingleLettersCount = combined.length;
	
	var combos = [];
	
	var discarded = discardedCombinations.split(",");
	
	var combNum = 0;
	
	if (styleQuality === "Best Quality" || styleQuality === "High Quality") { //If two-letter combinations should be included
		for (let i = 0; i < combined.length; i++) {
			for (let j = 0; j < combined.length; j++) {
				let comb = combined[i] + "-" + combined[j];
				if (!discarded.containsPrimitive(comb.replace("-",""))) {
					combos[combNum] = comb;
					combNum++;
				}
			}
		}
		combos = combined.concat(capitals, combos);
	} else {
		combos = combined.concat(capitals);
	}
	
	return combos;
}



// -------- Loading --------

function GetVariablesFromUrl() {
	//Initial uri read stuff
	var uriHash = window.location.hash;
	
	//Isolate variables in uri
	var styleDecimal = "";
	var styleQuality = "";
	var letterWidths = "";
	for (var i = 0; i < uriHash.length - 1; i++) {
		let chr = uriHash.substr(i,1);
		if (chr === "#" || chr === ";") {
			if (uriHash.substr(i, 1) === "#" || uriHash.substr(i, 1) === ";") {
				let ip1 = i + 1;
				if (uriHash.substr(ip1, 6).toLowerCase() === "style=") {
					styleDecimal = uriHash.substring(ip1 + 6, uriHash.indexOf(";", ip1));
				} else if (uriHash.substr(ip1, 8).toLowerCase() === "quality=") {
					styleQuality = uriHash.substring(ip1 + 8, uriHash.indexOf(";", ip1));
				} else if (uriHash.substr(ip1, 13).toLowerCase() === "letterwidths=") {
					letterWidths = uriHash.substring(ip1 + 13, uriHash.indexOf(";", ip1));
				} else {
					throw new Error("Invalid uri variable name.");
				}
			} else {
				throw new Error("Invalid uri variable name.");
			}
			i = uriHash.indexOf(";", i + 1) - 1;
		}
	}
	
	//Interpret variables
	//Style Quality
	if      (styleQuality === "1") { styleQuality = "Best Quality"     ; }
	else if (styleQuality === "2") { styleQuality = "High Quality"     ; }
	else if (styleQuality === "3") { styleQuality = "Quick Setup"      ; }
	else if (styleQuality === "4") { styleQuality = "Extra Quick Setup"; }
	else if (styleQuality === "" ) { styleQuality = "Best Quality"     ; }
	else { throw new Error("Invalid style quality setting in uri"); }
	//Style Decimal
	styleDecimal = LZString.decompressFromEncodedURIComponent(styleDecimal) || "";
	
	
	return {styleQuality:styleQuality, styleDecimal:styleDecimal, letterWidths:letterWidths};
}

function LoadCanvasDataFromStyleDecimal(styleDecimal, combinations) {
	//Setup
	const len = styleDecimal.length;
	var styleData = new Array(combinations.length);
	for (var i = 0; i < styleData.length; i++) {
		styleData[i] = {strokeData:[]};
	}
	
	if (len === 0) { return styleData; }
	var combinationNum = 0;
	
	//Loop through uri string and populate styleData
	var strokeData = [];
	var curX = 0;
	var curY = 0;
	for (var i = 0; i < len;) { //increment is variable
		let chr = styleDecimal.substr(i,1);
		if (chr === "7") { //new canvas
			if (i !== 0) {
				styleData[combinationNum] = {strokeData:strokeData};
				combinationNum++;
			}
			strokeData = [];
			curX = 0;
			curY = 0;
			i += 1;
		} else {
			let gap = false;
			let dx = 0; //delta x
			let dy = 0; //delta y
			if (chr === "8") { //two three-digit coords, gap = true
				gap = true;
				dx = (parseInt(styleDecimal.substr(i + 1,3)) - 300) * 2;
				dy = (parseInt(styleDecimal.substr(i + 4,3)) - 300) * 2;
				i += 7;
			} else if (chr === "9") { //two three-digit coords, gap = false
				dx = (parseInt(styleDecimal.substr(i + 1,3)) - 300) * 2;
				dy = (parseInt(styleDecimal.substr(i + 4,3)) - 300) * 2;
				i += 7;
			} else { //chr = 0,1,2,3,4,5,6 //two two-digit coords, gap = false
				dx = (parseInt(styleDecimal.substr(i    ,2)) - 50) * 2;
				dy = (parseInt(styleDecimal.substr(i + 2,2)) - 50) * 2;
				i += 4;
			}
			
			curX += dx;
			curY += dy;
			
			strokeData.push({x:curX, y:curY, gap:gap});
		}
	}
	styleData[combinationNum] = {strokeData:strokeData};
	
	return styleData;
}

function LoadLetterWidthsFromString(letterWidthsStr, singleLettersCount) {
	//Setup
	letterWidthsStr = "," + letterWidthsStr;
	var letterWidthsArr = new Array(singleLettersCount);
	for (var i = 0; i < letterWidthsArr.length; i++) {
		letterWidthsArr[i] = {0:0.32, 1:0.68}
	}
	var arrayIndex = 0;
	
	//Loop and populate
	for (var i = 0; i < letterWidthsStr.length; i++) {
		let chr = letterWidthsStr.substr(i, 1);
		if (chr === ",") {
			try {
				let numPair = letterWidthsStr.substringPositiveOnly(i + 1, letterWidthsStr.indexOf(",", i + 1));
				let num1 = numPair.substringPositiveOnly(0, numPair.indexOf("+"));
				let num2 = numPair.substring(num1.length + 1);
				num1 = parseInt(num1) / 100;
				num2 = parseInt(num2) / 100;
				letterWidthsArr[arrayIndex] = {0:num1, 1:num2};
				arrayIndex++;
				i += numPair.length + 1 - 1;
			} catch(e) {
				if (e.name === "InvalidIndexError") {
					arrayIndex++;
				} else {
					throw e;
				}
			}
		}
	}
	return letterWidthsArr;
}