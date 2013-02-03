.PHONY: all build clean
all: build

NODE_MODULES = ./node_modules
BOWER_MODULES = ./static/components
DB-PATH = ~/mongodb

build:
	@echo 'installing node modules'
	@npm install
	@cd node_modules/tplcpl && npm install uglify-js && cd -
	@mkdir $(BOWER_MODULES)
	@echo 'installing bower components'
	@node ./node_modules/bower/bin/bower install
	@mkdir $(BOWER_MODULES)/bootstrap/css
	@node ./node_modules/less/bin/lessc $(BOWER_MODULES)/bootstrap/less/bootstrap.less > $(BOWER_MODULES)/bootstrap/css/bootstrap.css
	@rm $(BOWER_MODULES)/bootstrap/js/bootstrap-popover.js
	@cat $(BOWER_MODULES)/bootstrap/js/*.js > $(BOWER_MODULES)/bootstrap/js/bootstrap.js
	@echo 'building bootstrap'
	@node node_modules/borschik/bin/borschik -i static/components/bootstrap/js/bootstrap.js -t js > static/components/bootstrap/js/bootstrap.min.js
	@node node_modules/borschik/bin/borschik -i static/components/bootstrap/css/bootstrap.css -t css > static/components/bootstrap/css/bootstrap.min.css
	@echo 'building iOS GUI library'
	@cd $(BOWER_MODULES)/ratchet && make build
	@echo 'copmpiling client-side templates'
	node_modules/tplcpl/app/cpl.js -t views/ -o static/js/jade.js
clean:
	-rm -rf $(NODE_MODULES)
	-rm -rf $(BOWER_MODULES)
	rm static/js/jade.js
jade:
	node_modules/tplcpl/app/cpl.js -t views/ -o static/js/jade.js
start:
	@echo 'starting node'
	@node boot.js
db-template:
	@echo 'creating basic db records'
	@node lib/helpers/db-template.js
db-erase:
	@echo 'removing records'
	@node lib/helpers/db-erase.js
db-show:
	node lib/helpers/db-show.js
db-test:
	node lib/helpers/db-test.js
db-start:
	mongod --dbpath $(DB-PATH)


