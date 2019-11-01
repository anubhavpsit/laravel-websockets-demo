//require Echo from 'laravel-echo'
//window.Pusher = require('pusher-js');
//require('./bootstrap');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.MIX_PUSHER_APP_KEY,
//     wsHost: process.env.MIX_PUSHER_APP_BROADCASTING_HOST,
//     wsPort: process.env.MIX_PUSHER_APP_BROADCASTING_PORT,
//     disableStats: true,
// });

// window.Laravel = <?php echo json_encode([
//     'csrfToken' => csrf_token(),
// ]); ?>;
var module = { }; /*   <-----THIS LINE */

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: '{{env("PUSHER_KEY")}}',
//     cluster: 'eu',
//     encrypted: true,
//     authEndpoint: '{{env("APP_URL")}}/broadcasting/auth'
// });

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'websocketkey',
    wsHost: '127.0.0.1',
    wsPort: '6001',
    disableStats: true,
});


$(document).ready(function(){
            console.dir("READY");

    currentGroupMessages = []; // To set glbal we have to use var keyword
    currentLiveUsers = []; // To set glbal we have to use var keyword
    Echo.join('chat')
        .here(users => {
            //console.dir("JOINED");
            this.users = users;
            //console.dir(this.users);
            chatUsersUi(this.users);
            currentLiveUsers = this.users;
        })
        .joining(user => {
            this.users.push(user);
            chatUsersUi(this.users);
            currentLiveUsers = this.users;
        })
        .leaving(user => {
            this.users = this.users.filter(u => u.id !== user.id);
            chatUsersUi(this.users);
            currentLiveUsers = this.users;
        })
        .listenForWhisper('typing', ({id, name}) => {
            this.users.forEach((user, index) => {
                if (user.id === id) {
                    user.typing = true;
                    this.$set(this.users, index, user);
                }
            });
        })
        .listen('MessageSent', (event) => {
            var a = {
               created_at: event.message.created_at,
               id: event.message.id,
               message: event.message.message,
               message_type: event.message.message_type,
               updated_at: event.message.updated_at,
               user: event.user,
               user_id: event.message.user_id
            }
            //console.dir(a);
            currentGroupMessages.push(a);
            //console.dir(event);
            chatMessagesListUiRow(a);
            // this.messages.push({
            //     message: event.message.message,
            //     user: event.user
            // });

            this.users.forEach((user, index) => {
                if (user.id === event.user.id) {
                    user.typing = false;
                    this.$set(this.users, index, user);
                }
            });
        });


    getMessages();
    chatMessagesListUi(currentGroupMessages);
});

function chatUsersUi(users) {
    if(users.length) {
        var userlistHtml = "<ul class='list-group'>";
        for(var i=0;i<users.length;i++) {
            userlistHtml += "<li  class='list-group-item' data-user-id='"+users[i].id+"' data-user-email='"+users[i].email+"'>";
            userlistHtml += users[i].name;
            userlistHtml += "</li>";
        }        
        userlistHtml += "</ul>";
        $("#currentOnlineUsers").html(userlistHtml);
    } else {
        $("#currentOnlineUsers").html('');
    }
}

function chatMessagesListUi(messages) {

    if(messages.length) {
        var groupMessagesHtml = "<ul class='chat'>";
        for(var i=0;i<messages.length;i++) {
            groupMessagesHtml += "<li class='left clearfix'>";
            groupMessagesHtml += "<div class='chat-body clearfix'>";
            groupMessagesHtml += "<div class='header'>";
            groupMessagesHtml += "<strong class='primary-font'>";
            groupMessagesHtml += messages[i].user.name;
            groupMessagesHtml += "</strong>";
            groupMessagesHtml += "</div>";
            groupMessagesHtml += "<p>";
            groupMessagesHtml += messages[i].message;
            groupMessagesHtml += "</p>";
            groupMessagesHtml += "</div>";
            groupMessagesHtml += "</li>";
        }
        groupMessagesHtml += "</ul>";
        $("#currentGroupMessages").html(groupMessagesHtml);
    } else {
        $("#currentGroupMessages").html('');
    }
}

function chatMessagesListUiRow(message) {
    console.dir(message);
    var groupMessagesHtml = "<li class='left clearfix'>";
    groupMessagesHtml += "<div class='chat-body clearfix'>";
    groupMessagesHtml += "<div class='header'>";
    groupMessagesHtml += "<strong class='primary-font'>";
    groupMessagesHtml += message.user.name;
    groupMessagesHtml += "</strong>";
    groupMessagesHtml += "</div>";
    groupMessagesHtml += "<p>";
    groupMessagesHtml += message.message;
    groupMessagesHtml += "</p>";
    groupMessagesHtml += "</div>";
    groupMessagesHtml += "</li>";
    $("#currentGroupMessages").find('.chat').append(groupMessagesHtml);
}

function getMessages() {
  var url = '/group/messages';
  $.ajax({
   url:url,
   method:"GET",
   dataType:'JSON',
   async: false,
   headers: {
     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
   },
   success:function(data)
   {
    currentGroupMessages = data;
   },
   error:function (reject) {
    console.dir(reject);
   }
  })  
}

function sendMessage(ele) {
    sendBy = $(ele).parent().data('user-id');
    var user = currentLiveUsers.find(x => x.id === sendBy);
    var newMessage = $("#btn-input").val();
    var messageType = 0;
    var mData = {
        user: user,
        message: newMessage
    };

    //Echo.channel('presence-chat').emit('messagesent', mData);
    //Echo.connector.socketId.bind('messagesent', 'chat', mData);
    var url = '/group/messages';
    $.ajax({
        url:url,
        method:"POST",
        dataType:"JSON",
        data: mData,
        async: false,
        headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        success:function(response)
        {
        //console.dir(response);
        var a = {
           created_at: response.data.message.created_at,
           id: response.data.message.id,
           message: response.data.message.message,
           message_type: messageType,
           updated_at: response.data.message.updated_at,
           user: response.data.user,
           user_id: response.data.message.user_id
        }
        //console.dir(a);
        chatMessagesListUiRow(a);
        },
        error:function (reject) {
        console.dir(reject);
        }
    })
}