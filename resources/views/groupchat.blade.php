@extends('layouts.groupapp')
<script>
    window.Laravel = <?php echo json_encode([
        'csrfToken' => csrf_token(),
    ]); ?>;
    var module = { }; /*   <-----THIS LINE */
</script>

@section('content')

</script>
    <div class="container chats">
        <div class="row">
<!--             <div class="col-md-8 col-md-offset-2">
                <div class="card card-default">
                    <div class="card-header">Chats</div>

                    <div class="card-body">
                        <chat-messages :messages="messages"></chat-messages>
                    </div>
                    <div class="card-footer">
                        <chat-form
                                @messagesent="addMessage"
                                :user="{{ auth()->user() }}"
                        ></chat-form>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <ul class="list-group">
                    <li class="list-group-item" v-for="user in users">
                        @{{ user.name }} <span v-if="user.typing" class="badge badge-primary">typing...</span>
                    </li>
                </ul>
            </div> -->
            <div class="col-md-8 col-md-offset-2">
                <div class="card card-default">
                    <div class="card-header">Chats</div>

                    <div class="card-body" id="currentGroupMessages">
                        
                    </div>
                    <div class="card-footer">

                        <div class="input-group">
                            <input id="btn-input" type="text" name="message" class="form-control input-sm" placeholder="Type your message here..." />
                            <span class="input-group-btn" data-user-id="{{Auth::id()}}">
                                <button class="btn btn-primary btn-sm" id="btn-send-message" onClick="sendMessage(this)">
                                    Send
                                </button>
                                <button class="btn btn-primary btn-sm" id="btn-send-file" onClick="sendFile(this)">
                                    Attach
                                </button>
                            </span>
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-md-4" id="currentOnlineUsers">

            </div>
        </div>
    </div>
@endsection