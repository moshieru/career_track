all_persons_courses = XQuery("sql: SELECT * FROM career_tracks.all_persons_courses apc WHERE apc.id IN (SELECT MIN(id) FROM career_tracks.all_persons_courses WHERE person_id = " + 7486349730272889682 + " AND state_id = '4' GROUP BY course_id)");
activeTrack = ArrayOptFirstElem(XQuery("sql: SELECT * FROM career_tracks.collabs_tracks WHERE collab_id = '" + 7486349730272889682 + "' AND main_or_not = 'true'"));
curUserID = 7486349730272889682;
isActivated = XQuery("sql: SELECT track_id FROM career_tracks.collabs_tracks WHERE collab_id = '" + curUserID + "' AND is_activated = 'true' AND track_id = '" + activeTrack.track_id + "'");
alert(ArrayCount(isActivated));

    if(ArrayCount(isActivated) == 0 && curUserID == 7486349730272889682){

        function checkLevel(level_id, person_id){
            // узнаем, есть ли начатый уровень у сотрудника - если есть: вернем id записи, иначе 0
            collab_level_id = 0;
            collab_level = ArrayOptFirstElem(XQuery("sql: SELECT id FROM career_tracks.collab_levels WHERE level_id = "+ level_id +" AND collabs_tracks_id = "+ activeTrack.id +""));
                
            if(collab_level != undefined){
collab_level_id = collab_level.id;
}
                
            return collab_level_id;
        }
function countCompetencePercent(level_id, competence_id, persons_courses, person_track_id){
            
            // если это компетенция уровня, то выполняем этот запрос
            if(level_id != 0){
                // все курсы компетенции
                all_competence_courses = XQuery("sql: SELECT course_id FROM career_tracks.courses_from_tracks WHERE level_id = "+ level_id +" AND competence_id = "+ competence_id +" AND track_id = " + person_track_id + "");
            } else {

                // все курсы компетенции
                all_competence_courses = XQuery("sql: SELECT course_id FROM career_tracks.courses_from_tracks WHERE competence_id = "+ competence_id +" AND track_id = " + person_track_id + "");
            }
                
            courses_quantity = ArrayCount(all_competence_courses);
            courses_passed_quantity = 0;
                
            // проверяем какие курсы из компетенции пройдены, считаем средний процент прохождения (считаем общее кол-во и кол-во пройденных)
            for(one_competence_course in all_competence_courses){
                for(one_person_course in persons_courses){
                    if(one_competence_course.course_id == one_person_course.course_id){courses_passed_quantity++;}
                }
            }
                
            return (Math.round((Real(courses_passed_quantity) / courses_quantity) * 100));
        }

        function update_or_create_competence(person_track_id, person_competence_id, level, new_percent){

            if(level != 0){

                competence = ArrayOptFirstElem(XQuery("sql: SELECT * FROM career_tracks.collab_competences WHERE competence_id = "+ person_competence_id +" AND collabs_tracks_id = "+ person_track_id +" AND level_id = "+ level +""));

                if(competence != undefined){
                    update_person_competence = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collab_competences SET "percent" = ' + new_percent + ' WHERE id = ' + competence.id + ' AND level_id = ' + level + ''));
                } else{ // иначе добавляем новую строку
                    create_person_competence = ArraySelectAll(XQuery('sql: INSERT INTO career_tracks.collab_competences (competence_id, collabs_tracks_id, level_id, "percent") VALUES ('+ person_competence_id +', ' + person_track_id + ', ' + level + ', ' + Int(new_percent) + ')'));
                }

            }else{
                competence = ArrayOptFirstElem(XQuery("sql: SELECT * FROM career_tracks.collab_competences WHERE competence_id = "+ person_competence_id +" AND collabs_tracks_id = "+ person_track_id +""));

                if(competence != undefined){
                    update_person_competence = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collab_competences SET "percent" = ' + new_percent + ' WHERE id = ' + competence.id + ''));
                } else{ // иначе добавляем новую строку
                    create_person_competence = ArraySelectAll(XQuery('sql: INSERT INTO career_tracks.collab_competences (competence_id, collabs_tracks_id, "percent") VALUES ('+ person_competence_id +', ' + person_track_id + ', ' + Int(new_percent) + ')'));
                }
            }

            return 1;
        }

        function countLevelPercent(level_id, person_id){
            persons_competences = XQuery("sql: SELECT * FROM career_tracks.collab_competences WHERE collabs_tracks_id = " + activeTrack.id + " AND level_id = " + level_id + "");

            competence_quantity = ArrayCount(persons_competences);
            percent = 0;

            for(competence in persons_competences){
                percent += Int(competence.percent);
            }

            return (Math.round(percent / competence_quantity));
        }

        function update_or_create_level(person_level_id, percent, level){
            if (person_level_id) { // уровень есть
                // обновляем процент прохождения уровня в таблице
                update_person_level = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collab_levels SET "percent" = ' + percent + ' WHERE id = ' + person_level_id + ''));
            } else { // уровня нет
                // создаем активный уровень у сотрудника, добавляем процент в таблицу
                create_person_level = ArraySelectAll(XQuery('sql: INSERT INTO career_tracks.collab_levels (collabs_tracks_id, level_id, "percent") VALUES (' + activeTrack.id + ', ' + level + ', ' + Int(percent) + ')'));
            }
        }

        function countTrackPercent(person_track_id, person_id){
            persons_competences = XQuery("sql: SELECT percent FROM career_tracks.collab_competences WHERE collabs_tracks_id = " + person_track_id + "");

            competence_quantity = ArrayCount(persons_competences);
            percent = 0;

            for(competence in persons_competences){
                percent += Int(competence.percent);
            }

            return (Math.round(percent / competence_quantity));
        }

if(activeTrack.track_id == 1 || activeTrack.track_id == 5 || activeTrack.track_id == 6 || activeTrack.track_id == 7) {

                course_person_level1 = checkLevel(1, 7486349730272889682);
                course_person_level2 = checkLevel(2, 7486349730272889682);

level1_CompetencesNames = XQuery("sql: SELECT DISTINCT competence_id FROM career_tracks.courses_from_tracks WHERE track_id = '" + activeTrack.track_id + "' AND level_id = '" + 1 + "'");

                for(one_competence in level1_CompetencesNames) {
                    new_percent = countCompetencePercent(1, one_competence.competence_id, all_persons_courses, activeTrack.track_id);
course_person_competence = update_or_create_competence(activeTrack.id, one_competence.competence_id, 1, new_percent);
                }

                level2_CompetencesNames = XQuery("sql: SELECT DISTINCT competence_id FROM career_tracks.courses_from_tracks WHERE track_id = '" + activeTrack.track_id + "' AND level_id = '" + 2 + "'");

                for(one_competence in level2_CompetencesNames) {
                 new_percent = countCompetencePercent(2, one_competence.competence_id, all_persons_courses, activeTrack.track_id);
course_person_competence = update_or_create_competence(activeTrack.id, one_competence.competence_id, 2, new_percent);
                }

                new_percent1 = countLevelPercent(1, curUserID);
                new_percent2 = countLevelPercent(2, curUserID);

                up_cr_l1 = update_or_create_level(course_person_level1, new_percent1, 1);
                up_cr_l2 = update_or_create_level(course_person_level2, new_percent2, 2);

                new_percent = countTrackPercent(activeTrack.id, curUserID);

update_person_track = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET "percent" = ' + new_percent + ' WHERE id = ' + activeTrack.id + ''));
}
activate_track = ArraySelectAll(XQuery('sql: UPDATE career_tracks.collabs_tracks SET is_activated = ' + true + ' WHERE id = ' + activeTrack.id + ''));
}