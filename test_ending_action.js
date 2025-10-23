career_track_test = Int(Param.test_id);
all_tests = XQuery("sql: SELECT * FROM dbo.test_learnings WHERE assessment_id = "+ career_track_test +" AND person_id = "+ learningDoc.person_id +"");
person_first_track = XQuery("sql: SELECT * FROM career_tracks.collabs_tracks WHERE collab_id = "+ learningDoc.person_id +" AND track_id = '1'");

fallen_tests = 0;
successed_tests = 0;

if(person_first_track != undefined){

    if(person_first_track.percent < 80){
        for(test in all_tests){
            if(test.state_id != 4){
                fallen_tests++;
            }
            else{
                successed_tests++;
            }
        }
        if(fallen_tests != 2){
            updated_track = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET "percent" = '"100"' WHERE collab_id = ' + learningDoc.person_id + ' AND track_id ="1"'));
        }
    }
}
