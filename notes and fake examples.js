// basic nesting and siblings
var text = 'Fig jam';
var other = 'is great';
// parens _or_ thin arrow defines a list of children
@<header->h2('Hi there'),p(text,span(other),'more text')>

// mapping to an array
var data = ['fred', 'mary', 'john', 'jenny'];
@<div->ul.names->li.person:data>

// mapping to an array (alt)
// here we're defining ul's children as a lambda
@<div->ul.names->(idx, val)=>li(val)>

// mapping an object
var data = {'fred': 'mary', 'john': 'jenny'};
@<div->ul.names->(key, val)=>li(span.husband(key), span.wife(val))>

var text = 'sometext <html here></html>'