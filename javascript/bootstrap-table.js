(function($){
	
    $.table = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
	
		// Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
		base.options = options;
		
		base.systemParameters = {
			filter:'',
			page:''
		};
		
		base.error = false;
		base.message = { 
			nourl : "<strong>Oh snap!</strong> We couldn't finde a url to load this table.",
			loadFail : "<strong>Oh snap!</strong> The table failed to load from the remote url.",
			requestError : "<strong>Oh snap!</strong> The server responded incorectaly.",
			noRecords : "<strong>Heads up!</strong> No records where found."
		};
		
		//the number of columns in this table
		
 		base.th;
		base.parameters;
		
		base.filter;
		base.records = {};
		base.bbar;
		base.tbar;

        // Add a reverse reference to the DOM object
        base.$el.data("table", base);

        base.init = function(){
           base.options = $.extend({},$.table.defaultOptions, options);
			base.options.url = base.$el.attr('url') || base.options.url;
			base.options.size = base.$el.attr('size') || base.options.size;

			base.th = base.$el.find('thead th');
			
			var params = base.$el.attr('parameters');
			if(params != null){
				base.parameters = jQuery.parseJSON('{' + params + '}');
			}
			
			if(base.options.url == null){
				base.error = true;
				base.errorMessage(base.message.nourl);
			}
			
			//if there are no errors load the table
			if(!base.error){
				base.initHead();
				base.load();
			}
			base.createTbar();
			
			base.bbar = $('<div/>').addClass("table-bbar");
			base.bbar.delegate("a", "click", function() {
			  	var page = $(this).attr("page-id");
			
				if(page != null){
					base.systemParameters.page = page;
					base.load();
				}
				
				return false;
			});
			base.$el.after(base.bbar);

        };

 		base.initHead = function(){
			base.th =  base.$el.find('thead th');

			base.th.click(function(){
				var derection = $(this).attr("data-derection");

			 	$(this).attr("data-derection","ASC");
				//$(this).find('i').removeClass("icon-arrow-up icon-arrow-up").addClass("icon-arrow-down");
				base.load();
			});
		}

        // Sample Function, Uncomment to use
         base.load = function(){
			var option = $.extend({},base.systemParameters, base.parameters);
	
			var request = $.ajax({
				context: base,
			  	type: base.options.requestType,
			  	url: base.options.url,
			  	data: option,
				dataType: 'json',
				success: function(data) {
					if(!data){
						base.errorMessage(base.message.requestError);
						return;
					}
					
					if(!data.success){
						base.errorMessage(data.message || base.message.requestError)
						return;
					}
					
					
					base.createBbar();
					
					if(data.records <= 0) {
						base.noticeMessage(base.message.noRecords);
						return;
					}
					
					base.records = data.data;
					base.processRecords();
					
				}
			});
			
			request.fail(function(jqXHR, textStatus, error) {
			  base.errorMessage(base.message.loadFail + " (" + jqXHR.status + ") " + error);
			});
        };

		base.processRecords = function(){
			base.$el.find('tbody tr').remove();
			
			for (var i in base.records) {
			  base.createRow(1, base.records[i]);
			}
        };

		base.createRow = function(dataId, record){
			var rowHtml = '<tr row-id="' + dataId + '">';
			
			base.th.each(function(key, value){
				var id = $(this).attr("data-id") || key;
				var value = record[id] || '&nbsp;';
				rowHtml = rowHtml + '<td>' + value + '</td>';
			});
			
			rowHtml = rowHtml + '</tr>';
			base.$el.find('tbody:last').append(rowHtml);
        };

		base.createTbar = function(){
			var $input = $('<input type="text" placeholder="Filter" class="span2"/>').keyup(function() {
				base.systemParameters.filter = $(this).val();
				base.load();
			});
			base.$el.before($input);
			$input.wrap('<div style="content: "";display: table;" class="tbar"><div style="float:right; display: inline-block;"></div></div>');
		};

		base.createBbar = function(){
			var records = '<div class="pull-left"><div>Showing 1 to 3 of 30 records</div></div>';
			
				var paging = '<li class="disabled"><a page-id="0" href="#">«</a></li>';
				var paging = paging + '<li class="active"><a href="#">1</a></li>';
				var paging = paging + '<li><a page-id="2" href="#">2</a></li>';
				var paging = paging + '<li class="disabled"><a href="#">...</a></li>';
				var paging = paging + '<li><a page-id="6"href="#">6</a></li>';
				var paging = paging + '<li><a page-id="7" href="#">7</a></li>';
				var paging = paging + '<li><a page-id="8" href="#">»</a></li>';
			
			var pagination = records + '<div class="pull-right pagination" style="margin:0px;"><ul>' + paging + '</ul></div>';		
			base.bbar.html(pagination);
		};

		base.noticeMessage = function(message){
			var columnCount = base.th.length;
			base.$el.find('tbody tr').remove();
			base.$el.find('tbody:last').append('<tr class="alert-info"><td colspan="' + columnCount + '">' + message + '</td></tr>');
		};

		base.errorMessage = function(message){
			var columnCount = base.th.length;
			base.$el.find('tbody tr').remove();
			base.$el.find('tbody:last').append('<tr class="alert-error"><td colspan="' + columnCount + '">' + message + '</td></tr>');
		};

        // Run initializer
        base.init();
    };

    $.table.defaultOptions = {
        initSelector: "table[data-role='table']",
		size: 10,
		requestType: 'GET',
    };

    $.fn.table = function(options){
		options = options || {};
			return this.find(options.initSelector || $.table.defaultOptions.initSelector).each(function(index) {
				(new $.table(this, $.table.defaultOptions));			
			})
		//return (new $.table(this, options));
    };

	//auto self-init
	$(document).ready(function(){
		$(document).table();
	});

})(jQuery);