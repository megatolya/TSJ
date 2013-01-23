.PHONY: all build clean
all: build

NODE_MODULES = ./node_modules
BOWER_MODULES = ./static/components


build:
	@echo 'installing node modules'
	@npm install
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

clean:
	-rm -rf $(NODE_MODULES)
	-rm -rf $(BOWER_MODULES)
start:
	node boot.js

