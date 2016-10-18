var app = angular.module('app', ['ngAnimate', 'ngTouch', 'ui.grid', 'ui.grid.pagination', 'ui.grid.selection']);

app.controller('MainCtrl',
[
    '$scope', '$http', '$timeout', 'uiGridConstants', function($scope, $http, $timeout, uiGridConstants) {
        var today = new Date();
        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        var paginationOptions = {
            pageNumber: 1,
            pageSize: 5,
            sort: 'desc',
            sortcolumn: 'Id'
        };

        var filterColumns = [];
        var filterTimeoutTimeout = 1500;

        $scope.gridOptions = {
            multiSelect: true,
            // enableFullRowSelection: true,
            enableRowHeaderSelection: true,
            paginationPageSizes: [5, 10, 25, 50, 75],
            paginationPageSize: 5,
            enableFiltering: true,
            enableRowSelection: true,
            enableGridMenu: true,
            useExternalFiltering: true,
            useExternalPagination: true,
            useExternalSorting: true,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope,
                    function(grid, sortColumns) {
                        if (sortColumns.length == 0) {
                            paginationOptions.sort = null;
                            paginationOptions.sortcolumn = null;
                        } else {
                            paginationOptions.sortcolumn = sortColumns[0].field;
                            paginationOptions.sort = sortColumns[0].sort.direction;
                        }

                        $scope.getPage();
                    });
                $scope.gridApi.pagination.on.paginationChanged($scope,
                    function(newPage, pageSize) {
                        paginationOptions.pageNumber = newPage;
                        paginationOptions.pageSize = pageSize;
                        $scope.getPage();
                    });
                $scope.gridApi.core.on.filterChanged($scope,
                    function(e) {
                        var grid = this.grid;
                        filterColumns = [];
                        angular.forEach(grid.columns,
                            function(value, key) {

                                angular.forEach(value.filters,
                                    function(filter, key) {

                                        if (filter.term != undefined) {
                                            filterColumns.push(
                                            {
                                                'column': value.field,
                                                'condition': filter.condition,
                                                'term': filter.term
                                            });
                                        }
                                    });
                            });

                        if (angular.isDefined($scope.filterTimeout)) {
                            $timeout.cancel($scope.filterTimeout);
                        }
                        $scope.filterTimeout = $timeout(function() {
                                // console.log($scope.filterTimeoutTimeout);
                                $scope.getPage();
                            },
                            filterTimeoutTimeout);
                    });
            },
            columnDefs: [
                // default
                {
                    field: 'Id',
                    headerCellClass: $scope.highlightFilteredHeader,
                    filter: {
                        condition: uiGridConstants.filter.EXACT,
                        placeholder: 'exact id'
                    }
                },
                {
                    field: 'Name',
                    headerCellClass: $scope.highlightFilteredHeader,
                    filter: {
                        condition: uiGridConstants.filter.CONTAINS,
                        placeholder: 'name id'
                    }
                },
                {
                    field: 'Gender',
                    headerCellClass: $scope.highlightFilteredHeader,
                    condition: uiGridConstants.filter.EXACT,
                    filter: {
                        term: '',
                        type: uiGridConstants.filter.SELECT,
                        selectOptions: [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
                    }
                },
                {
                    field: 'Company',
                    headerCellClass: $scope.highlightFilteredHeader,
                    condition: uiGridConstants.filter.CONTAINS
                },
                {
                    field: 'Email',
                    headerCellClass: $scope.highlightFilteredHeader,
                    condition: uiGridConstants.filter.CONTAINS
                },
                {
                    field: 'Phone',
                    headerCellClass: $scope.highlightFilteredHeader,
                    condition: uiGridConstants.filter.CONTAINS
                },
                // multiple filters
                {
                    field: 'Age',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: $scope.highlightFilteredHeader
                },
                // date filter
                {
                    field: 'Registered',
                    cellFilter: 'date:"dd/MM/y"',
                    width: '15%',
                    filters: [
                        {
                            condition: uiGridConstants.filter.GREATER_THAN_OR_EQUAL,
                            placeholder: 'greater than'
                        },
                        {
                            condition: uiGridConstants.filter.LESS_THAN_OR_EQUAL,
                            placeholder: 'less than'
                        }
                    ],
                    headerCellClass: $scope.highlightFilteredHeader
                }
            ]
        };

        $scope.getPage = function() {
            //console.log(filterColumns);
            // console.log(angular.toJson(filterColumns));
            var params = {
                pageNumber: paginationOptions.pageNumber,
                pageSize: paginationOptions.pageSize,
                sortDirection: paginationOptions.sort,
                sortColumn: paginationOptions.sortcolumn,
                filterColumnsJson: angular.toJson(filterColumns)
            }
            //console.log(params);
            $http.get('/api/Values',
                {
                    params: params
                })
                .success(function(data) {
                    console.log(data.Items);
                    $scope.gridOptions.totalItems = data.TotalItems;
                    //var firstRow = (paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
                    //$scope.gridOptions.data = data.slice(firstRow, firstRow + paginationOptions.pageSize);
                    $scope.gridOptions.data = data.Items;

                    data.Items.forEach(function addDates(row, index) {
                        // row.mixedDate = new Date();
                        // row.mixedDate.setDate(today.getDate() + (index % 14));
                        // row.gender = row.gender === 'male' ? '1' : '2';
                    });


                    //console.log(data);
                });
        };

        $scope.getPage();

        $scope.$on("$destroy",
            function(event) {
                if (angular.isDefined($scope.filterTimeout)) {
                    $timeout.cancel($scope.filterTimeout);
                }
            });

        //$http.get('/data/500_complex.json')
        //  .success(function (data) {
        //      $scope.gridOptions.data = data;
        //      $scope.gridOptions.data[0].age = -5;

        //      data.forEach(function addDates(row, index) {
        //          row.mixedDate = new Date();
        //          row.mixedDate.setDate(today.getDate() + (index % 14));
        //          row.gender = row.gender === 'male' ? '1' : '2';
        //      });
        //  });

        $scope.toggleFiltering = function() {
            $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        };

        $scope.showSelected = function() {
            var totRowCount = $scope.gridApi.selection.getSelectedCount();
            var ids = $scope.gridApi.selection.getSelectedRows();
            alert('Totale righe selezionate: ' + totRowCount + '. Ids: ' + angular.toJson(ids));
        };

    }
]);
//.filter('mapGender', function () {
//    var genderHash = {
//        1: 'male',
//        2: 'female'
//    };

//    return function (input) {
//        if (!input) {
//            return '';
//        } else {
//            return genderHash[input];
//        }
//    };
//});