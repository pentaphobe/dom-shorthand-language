'use strict';

var fs = require('fs');
var reCode = /@<(\w+.*[^-])>/gm;
var symbols = {};

var library = function() {
	var lib = {};
	var tagNames = 'header,h2,p,ul,li,div,span'.split(',');
	tagNames.forEach(tagName => {
		lib[tagName] = function (classNames, props) {
			return `<${tagName} class="${classNames.split(',').join(' ')}">${this.children()}</${tagName}>`;
		};
	});

	return lib;
};

function tokenize(partsArray) {
	var tokens = {
		tag: /^[a-z]+[\w_\-.:]*$/,
		arrow: /^->$/,
		fatArrow: /^=>$/,
		openParen: /^\($/,
		closeParen:/^\)$/,
		comma: /^,$/,
	};
	var result = [];
	var idx = 0;

	function next() {
		let result = partsArray[idx];
		if (idx >= partsArray.length) {
			result = undefined;
		}
		idx++;
		return result;
	}

	let tok;

	while ( (tok = next()) !== undefined) {
		var token = null;
		var data = null;
		// match regexes
		for (var k in tokens) {
			var re = tokens[k];			

			if (re.test(tok)) {
				token = k;
				data = tok;
				break;
			}
		}

		if (token === null) {
			if (tok === '\'') {
				token = 'string';
				data = next();
				let closeQuote = next();				
			}
		}

		if (token !== null) {
			result.push({
				token: token,
				data: data
			});
		}
	}	
	return result;
}

function lexify(tokens) {
	var result = tokens.map(tok => {
		var tokName = tok.token;
		var data = tok.data;

		if (tokName === 'tag') {
			let mapName = data.split(/:/)[1];
			let classNames = data.split(/\./)[1];
			let tagName = data.split(/[:\.]/)[0];
			console.log(tokName, data, tagName, classNames, mapName);
			return `lib.${tagName}(/*params*/)`;
		} 
		return tok;
	});
	return result;
}

function parse(src) {
	src = src.substr(2);
	var parts = src.split(/(->|=>|[\(\),\'])/);
	var tokens = tokenize(parts);
	var nodes = lexify(tokens);
	return JSON.stringify(tokens);
	// return src;
}

function compile(txt) {
	return `var library = (${library.toString()})();\n\n` + txt.replace(reCode, function(src) {
		return parse(src);
	});
}

var txt = fs.readFileSync('notes and fake examples.js').toString();
var compiled = compile(txt);

console.log( compiled );