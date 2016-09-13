/**
 * Created by dinusha on 9/12/2016.
 */

(function() {

    var mailInboxService = function($http, baseUrls, authService)
    {
        var getAllInboxMessages = function(limitCount, sinceId, msgType)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/All?limit=' + limitCount;

            if(sinceId)
            {
                url = url + '&since=' + sinceId;
            }

            if(msgType)
            {
                url = url + '&messageType=' + msgType;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getReadInboxMessages = function(limitCount, sinceId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Read?limit=' + limitCount;

            if(sinceId)
            {
                url = url + '&since=' + sinceId;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getUnReadInboxMessages = function(limitCount, sinceId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Unread?limit=' + limitCount;

            if(sinceId)
            {
                url = url + '&since=' + sinceId;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getDeletedInboxMessages = function(limitCount, sinceId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Messages/Deleted?limit=' + limitCount;

            if(sinceId)
            {
                url = url + '&since=' + sinceId;
            }

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var deleteInboxMessage = function(messageId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Message/' + messageId;

            return $http({
                method: 'DELETE',
                url: url,
                headers: {
                    'authorization': authToken
                }
            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var markMessageAsRead = function(messageId)
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Message/' + messageId + '/Read';

            return $http({
                method: 'PUT',
                url: url,
                headers: {
                    'authorization': authToken
                }

            }).then(function(resp)
            {
                return resp.data;
            })
        };

        var getMessageCounters = function()
        {
            var profileId = authService.GetProfileId();
            var authToken = authService.GetToken();

            var url = baseUrls.mailInboxUrl + profileId + '/Counts';

            return $http({
                method: 'GET',
                url: url,
                headers: {
                    'authorization': authToken
                }

            }).then(function(resp)
            {
                return resp.data;
            })
        };

        return {
            getAllInboxMessages: getAllInboxMessages,
            getReadInboxMessages: getReadInboxMessages,
            getUnReadInboxMessages: getUnReadInboxMessages,
            getDeletedInboxMessages: getDeletedInboxMessages,
            deleteInboxMessage: deleteInboxMessage,
            markMessageAsRead: markMessageAsRead,
            getMessageCounters: getMessageCounters
        };
    };

    var module = angular.module("veeryAgentApp");
    module.factory("mailInboxService", mailInboxService);

}());

