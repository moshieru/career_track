try{
    is_ok = 0;

    curr_user = curUser.id;
    track_id = Int(track_id);
    alert(curr_user + " " + track_id);
    person_track = ArrayOptFirstElem(XQuery("sql: SELECT * FROM career_tracks.collabs_tracks WHERE collab_id = " + curUser.id + " AND track_id = "+ track_id +""));
    if(person_track != undefined){
        if(!person_track.main_or_not){
            update_person_track = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET main_or_not = ' + true + ' WHERE collab_id = ' + curr_user + ' AND track_id = '+ track_id +''));
            update_person_tracks = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET main_or_not = ' + false + ' WHERE collab_id = ' + curr_user + ' AND track_id <> '+ track_id +''));
        }
    }
    else{
        update_person_tracks = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET main_or_not = ' + false + ' WHERE collab_id = ' + curr_user + ' AND track_id <> '+ track_id +''));
        create_person_track = ArraySelectAll(XQuery('sql: INSERT INTO career_tracks.collabs_tracks (track_id, main_or_not, "percent", collab_id) VALUES ('+ track_id +', ' + true + ', ' + 0 + ', ' + curr_user + ')'));
    }

    alert("Все хорошо");
    is_ok = 1;
    RESULT = {
        command: "call",
        fn: "1",
        fn_name: "afterDistantAction",
        fn_method: "afterDistantAction",
        args_array: [is_ok]
    }
}catch(e){
    alert("Не все хорошо");
    RESULT = {
        command: "call",
        fn: "1",
        fn_name: "afterDistantAction",
        fn_method: "afterDistantAction",
        args_array: ["Ошибка"]
    }
}