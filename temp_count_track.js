all_persons_courses = XQuery("sql: SELECT * FROM career_tracks.all_persons_courses apc WHERE apc.id IN (SELECT MIN(id) FROM career_tracks.all_persons_courses WHERE person_id = " + 7486349730272889682 + " AND state_id = '4' GROUP BY course_id)");
activeTrack = ArrayOptFirstElem(XQuery("sql: SELECT * FROM career_tracks.collabs_tracks WHERE collab_id = '" + 7486349730272889682 + "' AND main_or_not = 'true'"));

function checkLevel(level_id){
            // узнаем, есть ли начатый уровень у сотрудника - если есть: вернем id записи, иначе 0
            collab_level_id = 0;
            collab_level = ArrayOptFirstElem(XQuery("sql: SELECT id FROM career_tracks.collab_levels WHERE level_id = "+ level_id +" AND collabs_tracks_id = "+ 36 +""));
                
            if(collab_level != undefined){collab_level_id = collab_level.id;}
                
            return collab_level_id;
        }

//alert(checkLevel(1));

function countCompetencePercent(level_id, competence_id, persons_courses, person_track_id){
            
            // если это компетенция уровня, то выполняем этот запрос
            if(level_id != 0){
                // все курсы компетенции
                all_competence_courses = XQuery("sql: SELECT course_id FROM career_tracks.courses_from_tracks WHERE level_id = "+ level_id +" AND competence_id = "+ competence_id +" AND track_id = " + 1 + "");
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

//alert(countCompetencePercent(1, 7542773358599415411, all_persons_courses, 1));

        function countLevelPercent(level_id, person_id){
            collab_id = ArrayOptFirstElem(XQuery("sql: SELECT id FROM career_tracks.collabs_tracks WHERE track_id = 1 AND collab_id = " + person_id + ""));
            persons_competences = XQuery("sql: SELECT percent FROM career_tracks.collab_competences WHERE collabs_tracks_id = " + collab_id.id + " AND level_id = " + level_id + "");

            competence_quantity = ArrayCount(persons_competences);
            percent = 0;

            for(competence in persons_competences){
                percent += Int(competence.percent);
            }

            return (Math.round(percent / competence_quantity));
        }
//alert(countLevelPercent(1, 7486349730272889682));

        function countTrackPercent(person_track_id, person_id){
            collab_id = ArrayOptFirstElem(XQuery("sql: SELECT id FROM career_tracks.collabs_tracks WHERE track_id = " + person_track_id + "AND collab_id = " + person_id + ""));
            persons_competences = XQuery("sql: SELECT percent FROM career_tracks.collab_competences WHERE collabs_tracks_id = " + collab_id.id + "");

            competence_quantity = ArrayCount(persons_competences);
            percent = 0;

            for(competence in persons_competences){
                percent += Int(competence.percent);
            }

            return (Math.round(percent / competence_quantity));
        }
//alert(countTrackPercent(1, 7486349730272889682));

if(activeTrack.track_id == 1 || activeTrack.track_id == 5 || activeTrack.track_id == 6 || activeTrack.track_id == 7) {

                course_person_level1 = checkLevel(1);
//alert(course_person_level1);
                course_person_level2 = checkLevel(2);
//alert(course_person_level2);

uniqueCompetencesNames = XQuery("sql: SELECT DISTINCT competence_id FROM career_tracks.courses_from_tracks WHERE track_id = '" + activeTrack.track_id + "' AND level_id = '" + 1 + "'");
for(one_competence in uniqueCompetencesNames) {
                    new_percent = countCompetencePercent(1, one_competence.competence_id, all_persons_courses, activeTrack.track_id);
//alert(new_percent);
}

uniqueCompetencesNames = XQuery("sql: SELECT DISTINCT competence_id FROM career_tracks.courses_from_tracks WHERE track_id = '" + activeTrack.track_id + "' AND level_id = '" + 2 + "'");
for(one_competence in uniqueCompetencesNames) {
                    new_percent = countCompetencePercent(2, one_competence.competence_id, all_persons_courses, activeTrack.track_id);
//alert(new_percent);
}

                new_percent1 = countLevelPercent(1, 7486349730272889682);
//alert(new_percent1);
                //new_percent2 = countLevelPercent(2, 7486349730272889682);
//alert(new_percent2);
new_percent = countTrackPercent(activeTrack.track_id, 7486349730272889682);
//alert(new_percent);

uniqueCompetencesNames = XQuery("sql: SELECT DISTINCT competence_id FROM career_tracks.courses_from_tracks WHERE track_id = 2");
for(one_competence in uniqueCompetencesNames) {
                    new_percent = countCompetencePercent(0, one_competence.competence_id, all_persons_courses, 2);
//alert(new_percent);
                }

                new_percent = countTrackPercent(1, 7486349730272889682);
alert(new_percent);
}