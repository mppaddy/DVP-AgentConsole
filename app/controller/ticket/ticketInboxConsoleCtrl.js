agentApp.controller('ticketInboxConsoleCtrl', function ($scope, $rootScope, mailInboxService,
                                                        profileDataParser, authService, $http,
                                                        $anchorScroll, ticketService) {



    //ticket inbox

    $anchorScroll();
    //update new UI code
    var getWindowHeight = function (callback) {
        var height = window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        return callback(height);
    };
    getWindowHeight(function (height) {
        // document.getElementById('inboxToggleLeft').style.height = height + "px";
        document.getElementById('inboxRightWrapper').style.height = height + "px";
        document.getElementById('ticketListView').style.height = height - 230 + "px";
        document.getElementById('inboxToggleLeft').style.height = height - 100 + "px";
        $scope.ticketListHeight = height - 220 + "px";

        $scope.filterMenuScroller = height - 100 + "px";

    });

    window.onresize = function () {
        getWindowHeight(function (height) {
            document.getElementById('inboxRightWrapper').style.height = height + "px";
            document.getElementById('ticketListView').style.height = height - 230 + "px";
            document.getElementById('inboxToggleLeft').style.height = height - 100 + "px";
            $scope.ticketListHeight = height - 220 + "px";
            $scope.filterMenuScroller = height - 100 + "px";
        });
    };

    //all left toggle up
    $scope.isCollapsedInbox = true;
    $scope.isCollapsedMyTicket = false;
    $scope.isCollapsedGroupTicketr = true;
    $scope.isCollapsedFilter = true;
    $scope.isCollapsedSubmitted = true;
    $scope.isCollapsedWatchedByMe = true;
    $scope.isCollapsedCollaboratedByMe = true;

    //onload sort type
    $scope.sortType = 'updated_at';
    $scope.pageSize = 20;


    //ticket view object
    $scope.ticketList = [];
    $scope.currentSelected = {
        "name": '',
        "totalCount": ''
    };

    $scope.ticketCountObj = {
        'toDo': 0,
        'new': 0,
        'done': 0,
        'inProgress': 0,
        myTicket: {
            'myToDo': 0,
            'myNew': 0,
            'myDone': 0,
            'myInProgress': 0
        },
        myGroup: {
            'toDo': 0,
            'new': 0,
            'done': 0,
            'inProgress': 0
        },
        submittedByMe: {
            'toDo': 0,
            'new': 0,
            'done': 0,
            'inProgress': 0
        },
        watchedByMe: {
            'toDo': 0,
            'new': 0,
            'done': 0,
            'inProgress': 0
        },
        collaboratedByMe: {
            'toDo': 0,
            'new': 0,
            'done': 0,
            'inProgress': 0
        }
    };
    var ticketListObj = {
        '_id': '',
        'subject': '',
        'channel': '',
        'priority': '',
        'status': '',
        'type': '',
        'updated_at': '',
        'submitter_name': '',
        'submitter_avatar': ''
    };


    //UI funtion
    //ticket inbox UI funtion

    var ticketUIFun = function () {
        return {
            loadingMainloader: function () {
                $('#ticketMainLoader').removeClass('display-none');
            },
            loadedMainLoader: function () {
                $('#ticketMainLoader').addClass('display-none');
            },
            loadingNewCount: function () {
                $('#newCountLoaded').addClass('display-none');
                $('#newCountLoading').removeClass('display-none');
            },
            loadedNewCount: function () {
                $('#newCountLoaded').removeClass('display-none');
                $('#newCountLoading').addClass('display-none');
            },
            loadingToDo: function () {
                $('#toDoCountLoaded').addClass('display-none');
                $('#todoCountLoading').removeClass('display-none');
            },
            loadedToDo: function () {
                $('#toDoCountLoaded').removeClass('display-none');
                $('#todoCountLoading').addClass('display-none');
            },
            loadingInProgress: function () {
                $('#inProgressCountLoaded').addClass('display-none');
                $('#inProgressCountLoading').removeClass('display-none');
            },
            loadedInProgress: function () {
                $('#inProgressCountLoaded').removeClass('display-none');
                $('#inProgressCountLoading').addClass('display-none');
            },
            loadingDone: function () {
                $('#doneCountLoaded').addClass('display-none');
                $('#doneCountLoading').removeClass('display-none');
            },
            loadedDone: function () {
                $('#doneCountLoaded').removeClass('display-none');
                $('#doneCountLoading').addClass('display-none');
            },
            loadingRefreshBtn: function () {
                $('#btnRefreshLoading').removeClass('display-none');
                $('#btnRefresh').addClass('display-none');
            },
            loadedRefreshBtn: function () {
                $('#btnRefreshLoading').addClass('display-none');
                $('#btnRefresh').removeClass('display-none');
            }

        }
    }();


    //Ticket Inbox
    //private function
    var inboxPrivateFunction = function () {
        return {
            //get all new ticket count
            newTicketListCount: function (status) {
                //new count
                ticketUIFun.loadingNewCount();
                ticketService.getAllCountByTicketStatus('new').then(function (res) {
                    ticketUIFun.loadedNewCount();
                    $scope.ticketCountObj.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;

                    }
                });
            },
            toDoListCount: function () {
                //todo ticket
                ticketUIFun.loadingToDo();
                ticketService.getAllCountByTicketStatus('open&status=progressing').then(function (res) {
                    ticketUIFun.loadedToDo();
                    $scope.ticketCountObj.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            inProgressTicketListCount: function () {
                //progressing ticket
                ticketUIFun.loadingInProgress();
                ticketService.getAllCountByTicketStatus('progressing').then(function (res) {
                    ticketUIFun.loadedInProgress();
                    $scope.ticketCountObj.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            doneTicketListCount: function () {
                //closed ticket
                ticketUIFun.loadingDone();
                ticketService.getAllCountByTicketStatus('parked&status=solved&status=closed').then(function (res) {
                    ticketUIFun.loadedDone();
                    $scope.ticketCountObj.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //get count my ticket
            myTicketNewTicketCount: function () {
                //new ticket
                ticketService.getAllCountByMyticketStatus('new').then(function (res) {
                    $scope.ticketCountObj.myTicket.myNew = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myNew = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            }, myTicketToDoTicketCount: function () {
                //todo
                ticketService.getAllCountByMyticketStatus('open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.myTicket.myToDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myToDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            myTicketInProgressTicketCount: function () {
                //progressing
                ticketService.getAllCountByMyticketStatus('progressing').then(function (res) {
                    $scope.ticketCountObj.myTicket.myInProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myInProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            myTicketDoneTicketCount: function () {
                //closed ticket
                ticketService.getAllCountByMyticketStatus('parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.myTicket.myDone = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myTicket.myDone = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //get count my group
            groupTicketNewTicketCount: function () {
                //new ticket
                ticketService.getCountByMyGroupStatus('new').then(function (res) {
                    $scope.ticketCountObj.myGroup.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketToDoTicketCount: function () {
                //todo
                ticketService.getCountByMyGroupStatus('open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.myGroup.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketProgressingTicketCount: function () {
                //progressing
                ticketService.getCountByMyGroupStatus('progressing').then(function (res) {
                    $scope.ticketCountObj.myGroup.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            groupTicketClosedicketCount: function () {
                ticketService.getCountByMyGroupStatus('parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.myGroup.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.myGroup.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //ticket filter
            getTicketFilterCount: function (item, e) {
                item.count = 0;
                ticketService.GetTicketCountByView(item._id).then(function (response) {
                    item.count = response;
                    //$filter('filter')($scope.views, {_id: item._id},true)[0].count=response;
                }, function (err) {
                    authService.IsCheckResponse(err);
                    $scope.showAlert("Get View Count", "error", "Fail To Count.")
                });
            },
            //ticket submitted by me
            submittedTicketNewCount: function () {
                //new
                ticketService.getTicketsCount('TicketsSubmittedByMe', 'new').then(function (res) {
                    $scope.ticketCountObj.submittedByMe.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.submittedByMe.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            submittedTicketToDoCount: function () {
                //todo
                ticketService.getTicketsCount('TicketsSubmittedByMe', 'open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.submittedByMe.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.submittedByMe.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            submittedTicketProgressingCount: function () {
                //progressing
                ticketService.getTicketsCount('TicketsSubmittedByMe', 'progressing').then(function (res) {
                    $scope.ticketCountObj.submittedByMe.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.submittedByMe.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            submittedTicketClosedCount: function () {
                //closed
                ticketService.getTicketsCount('TicketsSubmittedByMe', 'parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.submittedByMe.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.submittedByMe.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //ticket watched by me
            watchedTicketNewCount: function () {
                //new
                ticketService.getTicketsCount('TicketsWatchedByMe', 'new').then(function (res) {
                    $scope.ticketCountObj.watchedByMe.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.watchedByMe.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            }, watchedTicketToDoCount: function () {
                //todo
                ticketService.getTicketsCount('TicketsWatchedByMe', 'open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.watchedByMe.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.watchedByMe.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            watchedTicketProgressCount: function () {
                //in progressing
                ticketService.getTicketsCount('TicketsWatchedByMe', 'progressing').then(function (res) {
                    $scope.ticketCountObj.watchedByMe.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.watchedByMe.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            watchedTicketDoneCount: function () {
                //done
                ticketService.getTicketsCount('TicketsWatchedByMe', 'parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.watchedByMe.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.watchedByMe.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            //ticket collaborated by me
            collaboratedTicketNewCount: function () {
                //new
                ticketService.getTicketsCount('TicketsCollaboratedByMe', 'new').then(function (res) {
                    $scope.ticketCountObj.collaboratedByMe.new = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.collaboratedByMe.new = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            collaboratedTicketToDoCount: function () {
                //todo
                ticketService.getTicketsCount('TicketsCollaboratedByMe', 'open&status=progressing').then(function (res) {
                    $scope.ticketCountObj.collaboratedByMe.toDo = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.collaboratedByMe.toDo = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            collaboratedTicketInProgressingCount: function () {
                //todo
                ticketService.getTicketsCount('TicketsCollaboratedByMe', 'progressing').then(function (res) {
                    $scope.ticketCountObj.collaboratedByMe.inProgress = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.collaboratedByMe.inProgress = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            collaboratedTicketDoneCount: function () {
                //todo
                ticketService.getTicketsCount('TicketsCollaboratedByMe', 'parked&status=solved&status=closed').then(function (res) {
                    $scope.ticketCountObj.collaboratedByMe.done = 0;
                    if (res && res.data && res.data.Result) {
                        $scope.ticketCountObj.collaboratedByMe.done = res.data.Result;
                        $scope.currentSelected.totalCount = res.data.Result;
                    }
                });
            },
            picketFilterInboxList: function (currentFilter, page) {
                ticketUIFun.loadingMainloader();
                ticketService.GetTicketsByView(currentFilter._id, page, $scope.sortType, $scope.pageSize).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response) {
                        $scope.ticketList = response.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.tid = item.tid;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            if (item.assignee) {
                                ticketListObj.assignee_name = item.assignee.firstname + " " + item.assignee.lastname;
                                ticketListObj.assignee_avatar = item.assignee.avatar;
                            } else {
                                ticketListObj.assignee_name = 'unAssigned';
                                ticketListObj.assignee_avatar = '';
                            }

                            if (item.assignee_group) {
                                ticketListObj.assignee_name = item.assignee_group.name;
                                ticketListObj.assignee_avatar = '';
                            }
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            },
            picketTicketInboxList: function (page, status, ticketType) {
                console.log($scope.sortType);
                ticketUIFun.loadingMainloader();
                ticketService.getAllTickets(page, status, ticketType, $scope.sortType, $scope.pageSize).then(function (response) {
                    ticketUIFun.loadedMainLoader();
                    if (response && response.data && response.data.Result) {
                        $scope.ticketList = response.data.Result.map(function (item, val) {
                            ticketListObj = {};
                            ticketListObj._id = item._id;
                            ticketListObj.tid = item.tid;
                            ticketListObj.subject = item.subject;
                            ticketListObj.channel = item.channel;
                            ticketListObj.priority = item.priority;
                            ticketListObj.status = item.status;
                            ticketListObj.type = item.type;
                            ticketListObj.updated_at = item.updated_at;
                            if (item.assignee) {
                                ticketListObj.assignee_name = item.assignee.firstname + " " + item.assignee.lastname;
                                ticketListObj.assignee_avatar = item.assignee.avatar;
                            } else {
                                ticketListObj.assignee_name = 'unAssigned';
                                ticketListObj.assignee_avatar = '';
                            }

                            if (item.assignee_group) {
                                ticketListObj.assignee_name = item.assignee_group.name;
                                ticketListObj.assignee_avatar = '';
                            }
                            return ticketListObj;
                        });
                    }
                }, function (error) {
                    authService.IsCheckResponse(error);
                    console.log(error);
                });
            }
        }
    }();


    $scope.openTicketView = function (_viewType, _selectedViewObj, selectedFilter, page, clickEvent) {
        $scope.ticketList = [];
        $scope.currentSelected.name = _viewType;
        $scope.currentSelected.totalCount = _selectedViewObj;

        if (clickEvent != 'goToPage') {
            page = 1;
            $scope.currentPage = page;
        } else {
            page = page ? page : '1';
        }
        _viewType = selectedFilter ? 'filter' : _viewType;
        switch (_viewType) {
            //ticket inbox
            case 'new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'Tickets');
                break;
            case 'todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'Tickets');
                break;
            case 'progressing':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'Tickets');
                break;
            case 'done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'Tickets');
                break;
            //my  ticket
            case 'my New':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'MyTickets');
                break;
            case 'my ToDo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'MyTickets');
                break;
            case 'my in Progressing':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'MyTickets');
                break;
            case 'my Done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'MyTickets');
                break;
            //my Group ticket
            case 'my group new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'MyGroupTickets');
                break;
            case 'my group todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'MyGroupTickets');
                break;
            case 'my group in progress':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'MyGroupTickets');
                break;
            case 'my group done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'MyGroupTickets');
                break;
            //ticket filter
            case 'filter':
                $scope.selectedFilter = selectedFilter;
                inboxPrivateFunction.picketFilterInboxList(selectedFilter, page);
                break;
            //ticket submitted by me
            case'submitted by me new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'TicketsSubmittedByMe');
                break;
            case'submitted by me todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'TicketsSubmittedByMe');
                break;
            case'submitted by me progress':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'TicketsSubmittedByMe');
                break;
            case'submitted by me done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'TicketsSubmittedByMe');
                break;
            //ticket watched by me
            case'watched by me new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'TicketsWatchedByMe');
                break;
            case'watched by me todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'TicketsWatchedByMe');
                break;
            case'watched by me inProgress':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'TicketsWatchedByMe');
                break;
            case'watched by me done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'TicketsWatchedByMe');
                break;
            //ticket collaborated by me
            case'collaborated by me new':
                inboxPrivateFunction.picketTicketInboxList(page, 'new', 'TicketsCollaboratedByMe');
                break;
            case'collaborated by me todo':
                inboxPrivateFunction.picketTicketInboxList(page, 'open&status=progressing', 'TicketsCollaboratedByMe');
                break;
            case'collaborated by me progress':
                inboxPrivateFunction.picketTicketInboxList(page, 'progressing', 'TicketsCollaboratedByMe');
                break;
            case'collaborated by me done':
                inboxPrivateFunction.picketTicketInboxList(page, 'parked&status=solved&status=closed', 'TicketsCollaboratedByMe');
                break;

        }
    };


    //goto view ticket filter
    $scope.goToFilterTicketView = function (_viewType, _selectedViewObj, selectedFilter, clickEvent) {
        $scope.selectedFilter = selectedFilter;
        $scope.ticketList = [];
        $scope.currentSelected.name = _viewType;
        $scope.currentSelected.totalCount = _selectedViewObj;

        if (clickEvent != 'goToPage') {
            page = 1;
            $scope.currentPage = page;
        } else {
            page = page ? page : '1';
        }
        inboxPrivateFunction.picketFilterInboxList(selectedFilter, '1');
    };


    //ticket filter


    $scope.loadTicketFilterViews = function (e) {
        ticketService.GetTicketViews().then(function (response) {
            $scope.views = response;
            angular.forEach($scope.views, function (item) {
                inboxPrivateFunction.getTicketFilterCount(item);
            });
        }, function (err) {
            authService.IsCheckResponse(err);
            $scope.showAlert("load Views", "error", "Fail To Load View List.");
        });
    };
    $scope.loadTicketFilterViews();


    //ticket list pagination
    // $scope.getPageData = function () {
    //    // console.log($scope.currentPage);
    //
    //     $scope.openTicketView($scope.currentSelected.name,
    //         $scope.currentSelected.totalCount,
    //         '',
    //         $scope.currentPage, )
    // };


    $scope.currentPage = 1;

    $scope.goToPagination = function () {
        $scope.openTicketView($scope.currentSelected.name,
            $scope.currentSelected.totalCount, $scope.selectedFilter,
            $scope.currentPage, 'goToPage');
    };


    //goto ticket view
    $scope.gotoTicket = function (data) {
        data.tabType = 'ticketView';
        data.reference = data._id;
        $rootScope.$emit('openNewTab', data);
    };

//todo test


    getJSONData($http, 'filters', function (data) {
        $scope.jsonFilterObj = data;
    });
    getJSONData($http, 'inboxFilters', function (data) {
        $scope.jsonInboxObj = data;
    });

    getJSONData($http, 'toDo', function (data) {
        $scope.jsonToDoObj = data;
    });

    $scope.checkAll = function () {
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.Items, function (item) {
            item.Selected = $scope.selectedAll;
        });

    };

    $scope.numberOfPages = function () {
        return Math.ceil($scope.getData().length / $scope.pageSize);
    };

    // for (var i = 0; i < 65; i++) {
    //     $scope.data.push("Item " + i);
    // };


    //on change sort ticket

    $scope.onChangeSortTicktList = function (sortType) {
        $scope.openTicketView($scope.currentSelected.name, $scope.currentSelected.totalCount, $scope.selectedFilter, '1');
    };


    var loadMyDefulatTicketView = function () {

        ticketUIFun.loadingRefreshBtn();
        //inbox count
        inboxPrivateFunction.toDoListCount();
        inboxPrivateFunction.newTicketListCount();
        inboxPrivateFunction.inProgressTicketListCount();
        inboxPrivateFunction.doneTicketListCount();

        //my ticket inbox count
        inboxPrivateFunction.myTicketNewTicketCount();
        inboxPrivateFunction.myTicketToDoTicketCount();
        inboxPrivateFunction.myTicketInProgressTicketCount();
        inboxPrivateFunction.myTicketDoneTicketCount();


        //my Group inbox count
        inboxPrivateFunction.groupTicketNewTicketCount();
        inboxPrivateFunction.groupTicketToDoTicketCount();
        inboxPrivateFunction.groupTicketProgressingTicketCount();
        inboxPrivateFunction.groupTicketClosedicketCount();

        //submitted by me
        inboxPrivateFunction.submittedTicketNewCount();
        inboxPrivateFunction.submittedTicketToDoCount();
        inboxPrivateFunction.submittedTicketProgressingCount();
        inboxPrivateFunction.submittedTicketClosedCount();

        //watched by me
        inboxPrivateFunction.watchedTicketNewCount();
        inboxPrivateFunction.watchedTicketToDoCount();
        inboxPrivateFunction.watchedTicketProgressCount();
        inboxPrivateFunction.watchedTicketDoneCount();

        //collaborated by me
        inboxPrivateFunction.collaboratedTicketNewCount();
        inboxPrivateFunction.collaboratedTicketToDoCount();
        inboxPrivateFunction.collaboratedTicketInProgressingCount();
        inboxPrivateFunction.collaboratedTicketDoneCount();

        //myTicket inbox
        //$scope.onClickMyTicket = function () {

        //};

        //init load todoList
        $scope.openTicketView('my ToDo', $scope.ticketCountObj.toDo, '', 1);

        ticketUIFun.loadedRefreshBtn();
    };
    loadMyDefulatTicketView();

    //click event refresh all
    $scope.ticketViewAllReload = function () {
        loadMyDefulatTicketView();
    };


}).filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
