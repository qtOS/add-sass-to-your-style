jQuery(function($){
  var socket = io.connect();
  var $nickForm = $('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#nickname');
  var $users = $('#users');
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');

  //user form submission
  $nickForm.submit(function(e){
    e.preventDefault();
    //calls to the socket to emit the new user into the chat field
    socket.emit('new user', $nickBox.val(), function(data){
      if(data){
        $('#nickWrap').hide();
        $('#contentWrap').show();
      } else{
        $nickError.html('That username is already taken!  Try again.');
      }
    });
    $nickBox.val('');
  });

  //users list
  socket.on('usernames', function(data){
    var user = '';
    //loops through users data and displays them
    for(var i=0; i < data.length; i++){
      user += '<li>'+data[i] + '</li>'
      console.log(data[i]+ ' has logged in.');
    //  console.log(user + ' - '+ i);
    }
    $users.html(user);
  });
  //sends error if whisper cannot be made
  $messageForm.submit(function(e){
    e.preventDefault();
    socket.emit('send message', $messageBox.val(), function(data){
      $chat.append('<span class="error">' + data + "</span><br/>");
      console.log(data);
    });
    $messageBox.val('');
  });




  //loops through old messages
  socket.on('load old msgs', function(docs){
    for(var i=docs.length-1; i >= 0; i--){
      displayMsg(docs[i]);
    }
  });

  socket.on('new message', function(data){
    displayMsg(data);
  });

  //display message to everyone
  function displayMsg(data){
    $chat.append('<span class="msg"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
  }

  //whisper users
  socket.on('whisper', function(data){
    $chat.append('<span class="whisper"><b>' + data.nick + ': </b>' + data.msg + "</span><br/>");
  });
});
