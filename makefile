# Set the source directory
srcdir = src/

# Create the list of modules
files = ${srcdir}app.js\
					${srcdir}article.js\
					${srcdir}carousel.js\
					${srcdir}app.js\
					${srcdir}events.js\
					${srcdir}model.js\
					${srcdir}util.collection.js\
					${srcdir}util.module.js\
					${srcdir}util.observable.js\
					${srcdir}view.js

# Compress all of the modules into pulp.js:

# Set both files to be built
all: pulp-dev.js pulp.js

# Combine all of the files into pulp-dev.js
pulp-dev.js: ${files}
	cat > $@ $^

# Compress pulp-dev.js into pulp.js
pulp.js: pulp-dev.js
	java -jar closure-compiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js $^ --js_output_file $@