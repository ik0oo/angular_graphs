angular

	.module('app', ['daterangepicker'])

	.constant('DATE', {
		format: 'YYYY-MM-DD',
		default: null
	})

	.factory('datesStorage', function($http, $templateCache) {
		// get and cached data form server

		var url = 'https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=JSON_CALLBACK';
		return {
			get: function() {
				return $http.jsonp(url, {
					cache: $templateCache
				});
			}
		}
	})

	.directive('highCharts', function() {
		return {
			restrict: 'E',
			template: '<div></div>',
			scope: {
				'info': '='
			},

			link: function(scope, element) {
				scope.$watch('info', function() {
					Highcharts.chart(element[0], {
						title: {
							text: 'USD to EUR exchange rate over time'
						},
						xAxis: {
							type: 'datetime'
						},
						yAxis: {
							title: {
								text: 'Exchange rate'
							}
						},
						legend: {
							enabled: false
						},
						plotOptions: {
							area: {
								fillColor: {
									linearGradient: {
										x1: 0,
										y1: 0,
										x2: 0,
										y2: 1
									},
									stops: [
										[0, Highcharts.getOptions().colors[0]],
										[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
									]
								},
								marker: {
									radius: 2
								},
								lineWidth: 1,
								states: {
									hover: {
										lineWidth: 1
									}
								},
								threshold: null
							}
						},

						series: [{
							data: scope.info
						}]
					});
				});
			}
		}
	})

	.directive('picker', function () {
		return {
			priority: 800,
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, element, attrs, ngModelController) {
				element.on('blur', function (e) {


					//ngModelController.$render();
					scope.$eval(function () {
						if (true) {
							console.log(scope.datePicker);
							//ngModelController.$modelValue = 12312;
							scope.datePicker = 123123;
						}
					});

				});
				scope.$on('destroy', function () {
					element.off('blur');
				});

				ngModelController.$formatters.unshift(function (value) {
					console.log(value);
					return value;
				});

				ngModelController.$parsers.unshift(function (value) {
					console.log(value);
					return value;
				});
			}
		}
	})

	.controller('datesCtrl', function($scope, datesStorage, DATE) {
		// chache request
		var dates = datesStorage.get();

		dates.then(function (data) {
			// set data from request
			$scope.data = data.data;
			var dateStart = moment($scope.data[0], 'x');
			var dateEnd = moment($scope.data[$scope.data.length - 1], 'x');

			// set datepicker options
			$scope.datePicker = {
				startDate: dateStart,
				endDate: dateEnd
			}
		});
		// datepicker hack options
		$scope.datePicker = {
			startDate: DATE.default,
			endDate: DATE.default
		};

		$scope.$watchGroup(['datePicker.startDate', 'datePicker.endDate'], function (newVal, oldVal) {
			// watch for date changes
			var newStartDate = newVal[0],
				newEndDate = newVal[1];

			if (newStartDate && newEndDate &&
				typeof newStartDate === 'object' &&  typeof newEndDate === 'object'
				) {
				setDate(newStartDate, newEndDate);
			}
		});

		var setDate = function(from, to) {
			// set new period from time to time

			return dates.then(function(date) {
				var date = date.data;
				$scope.data = date.filter(function(item) {
					return item[0] >= from && item[0] <= to;
				});
			})
		};
	});
