(function($){
	
    $.table = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;

		base.error = false;

		base.message
		base.message = { 
			nourl : "<strong>Oh snap!</strong> We couldn't finde a url to load this table.",
			loadFail : "<strong>Oh snap!</strong> The table failes to load from the remote url.",
			requestError : "<strong>Oh snap!</strong> The server responded incorectaly.",
			noRecords : "<strong>Heads up!</strong> No records where found"
		};
		
		//the number of columns in this table
 		base.th;
		base.url;
		base.requestType = 'POST';
		base.parameters;
		base.data = {};

        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;

        // Add a reverse reference to the DOM object
        base.$el.data("table", base);

        base.init = function(){
            base.options = $.extend({},$.table.defaultOptions, options);
			base.th = base.$el.find('thead th');
			base.url = base.$el.attr('url');
			
			var params = base.$el.attr('parameters');
			if(params != null){
				base.data = jQuery.parseJSON('{' + params + '}');
			}
			
			if(base.url == null){
				base.error = true;
				base.errorMessage(base.message.nourl);
			}
			
			//if there are no errors load the table
			if(!base.error){
				base.initHead();
				base.load();
			}
			
			//console.log(base.el.attributes);
        };

 		base.initHead = function(){
			$th =  base.$el.find('thead th');

			$th.click(function(){
				var derection = $(this).attr("data-derection");

			 	$(this).attr("data-derection","ASC");
				//$(this).find('i').removeClass("icon-arrow-up icon-arrow-up").addClass("icon-arrow-down");
				base.load();
			});
		}

        // Sample Function, Uncomment to use
         base.load = function(){
	
			var request = $.ajax({
				context: base,
			  	type: 'POST',
			  	url: base.url,
			  	data: base.data,
				dataType: 'json',
				success: function(data) {
					if(!data){
						base.errorMessage(base.message.requestError);
						return;
					}
					
					if(!data.success){
						( data.message ) ? base.errorMessage(data.message) : base.errorMessage(base.message.requestError);
						return;
					}
					
					if(data.records <= 0) {
						base.noticeMessage(base.message.noRecords);
						return;
					}
						
					base.processRecords(data.data);
				}
			});
			
			request.fail(function(jqXHR, textStatus) {
			  base.errorMessage(base.message.loadFail);
			});
        };

		base.processRecords = function(records){
			
			base.$el.find('tbody tr').remove();
			
			for (var i in records) {
			  base.createRow(1, records[i]);
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

		base.noticeMessage = function(message){
			var columnCount = base.th.length;
			base.$el.find('tbody tr').remove();
			base.$el.find('tbody:last').append('<tr class="alert-info"><td colspan="' + columnCount + '">' + message + '</td></tr>');
		}

		base.errorMessage = function(message){
			var columnCount = base.th.length;
			base.$el.find('tbody tr').remove();
			base.$el.find('tbody:last').append('<tr class="alert-error"><td colspan="' + columnCount + '">' + message + '</td></tr>');
		}

        // Run initializer
        base.init();
    };

    $.table.defaultOptions = {
        initSelector: "table[data-role='table']"
    };

    $.fn.table = function(options){
         return this.each(function(){
             (new $.table(this, options));
         });
		//return (new $.table(this, options));
    };

	//auto self-init
	$(document).ready(function(){
		//$("table[data-role='table']").each(function(index) {			
		//	var a = $(this).table();
		//	console.log(a);
		//})
		
		$("table[data-role='table']").table();
	});

})(jQuery);