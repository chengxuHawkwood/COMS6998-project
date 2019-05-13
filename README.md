# Project Auditor

## API

* endpoint url: https://huobgy5p9b.execute-api.us-east-1.amazonaws.com/dev
* [/user](#user)
* [/project](#project)
* [/course](#course)

### user

* GET /user

    Find a list of user data given search criterion.
    
    URL query parameters:
    
    * username: Username of the user to be found
    * userGithubName: Github username of the user to be found
    * userGithubProfName: Github profile name of the user to be found

    Only one of the above two parameters should be supplied. If no parameter is supplied, all users data are returned.
    Response format:
    ```
    [
        {
            "username": "dummy user",
            "userGithubName": "Terry1004",
            "userGithubProfName": "Yiming"
            "accessToken": "some token"
        }
    ]
    ```
    The field `userGithubProfName` is the name in the github user profile. It might appear in commit history as `author` or `commiter`. 

* POST /user

    Given username and temporary code issued by github, exchange for an access token from github and store it together with user names in database.

    Request body format:
    ```
    {
        "username": "dummy user",
        "code": "some code"
    }
    ```
    * username: The username of the user whose access token is to be retrieved from github
    * code: The temporary code issued by github in exchagne of an access token

    Response format:
    ```
    {
        "username": "dummy user",
        "userGithubName": "Terry1004",
        "userGithubProfName": "Yiming",
        "accessToken": "some token"
    }
    ```
    The field `userGithubProfName` is the name in the github user profile. It might appear in commit history as `author` or `commiter`. 

* DELETE /user
    
    Delete all user data from elasticsearch and is for internal use only. Hence it does not support CORS. Please invoke this method in API Gateway.

    Request body format: none

    Response format:
    ```
    {
        "acknowledged": true
    }
    ```

### project

* GET /project

    Find a list of projects data given search criterion.

    URL query parameters:

    * id: Id of the project to be found
    * username: Username of the user who is either the leader or a member of the project
    * inviteToken: Token contained in a invitation link. It will uniqely identify a project

    Only one of the above three parameters should be supplied. If no parameter is supplied, return all projects data.

    Response format:
    ```
    [
        {
            "id": "id of the project",
            "courseId": "id of the course containing this project",
            "projectName": "name of the project",
            "description": "description of the project",
            "leaderName": "username of the leader",
            "leaderGithubName": "github username of the leader",
            "memberNames": {
                "wrapperName": "Set",
                "values": [
                    "username of member"
                ],
                "type": "String"
            },
            "inviteToken": "some invite token",
            "expireTime": "expire time of the token, hard-coded to 24h after token generation"
            "repoName": "some repository"
            "stats": {
                commits: [            
                    {
                        "authorDate": "author time",
                        "committer": "committer's github username or profile name",
                        "committerDate": "commit time",
                        "message": "commit message",
                        "author": "author's github username or profile name"
                    },
                ],
                "eTag": "a tag helping with update commits history"
            }
        }
    ]
    ```
    * The `memberNames`, `inviteToken`, `expireTime`, and `stats` fields might not exist.
    * The `author` and `authorDate` should be the real commit user and time, `committer` and `committerDate` may refer to helper entity that executes the commit. Hence `committer` and `committerDate` may be removed in future if they are not considered useful.

* POST /project

    Create a new project. It will also add this project's id into the corresponding course in the `projects` field of the `Courses` table, so one does not need to update `Courses` table after this request.

    Request body format:
    ```
    {
        "courseId": "id of the course that contains the project",
        "projectName": "name of the project",
        "description": "description of the project",
        "repoName": "github repo name for this project",
        "leaderName": "leader username",
        "leaderGithubName": "github username of leader"
    }
    ```

    Response format:
    ```
    {
        "id": "system-generated unique id for this project"
        "courseId": "id of the course that contains the project",
        "projectName": "name of the project",
        "description": "description of the project",
        "repoName": "github repo name for this project",
        "leaderName": "leader username",
        "leaderGithubName": "github username of leader"
    }
    ```

* PUT /project

    Update partial project data.

    Request body formats (choose only one of the following):
    * Update miscellaneous project information
        ```
            {
                "id": "id of the project to update",
                "projectName: "name of the project",
                "description": "description of the project",
            }
        ```
        While some other fields are allowed to be updated via this method, changing them might result in unexpected behavior, so please only include the above three fields for this type of query.
    * Add a member to a project
        ```
        {
            "id": "id of the project to update",
            "memberNamesAdd": "username of the member to add"
        }
        ```
    * Delete a member from a project
        ```
        {
            "id": "id of the project to update",
            "memberNamesDelete": "username of the member to delete"
        }
        ```
    * Generate invite token of a project
        ```
        {
            "id": "id of the project to update",
            "inviteToken": "any nonempty string will suffice"
        }
        ```
    
    Response format (updated project data):
    ```
    {
        "id": "id of the project",
        "courseId": "id of the course containing this project",
        "projectName": "name of the project",
        "description": "description of the project",
        "leaderName": "username of the leader",
        "leaderGithubName": "github username of the leader",
        "memberNames": {
            "wrapperName": "Set",
            "values": [
                "username of member"
            ],
            "type": "String"
        },
        "inviteToken": "some invite token",
        "expireTime": "expire time of the token, hard-coded to 24h after token generation"
        "repoName": "some repository"
        "stats": {
            commits: [            
                {
                    "authorDate": "author time",
                    "committer": "committer's github username or profile name",
                    "committerDate": "commit time",
                    "message": "commit message",
                    "author": "author's github username or profile name"
                },
            ],
            "eTag": "a tag helping with update commits history"
        }
    }
    ```
    The `memberNames`, `inviteToken`, `expireTime`, and `stats` fields might not exist.

* DELETE /project

    Delete a project. It will also remove the project's id from the `Courses` table's `projects` field, so one does not need to update `Courses` table after this request.

    Request body format:
    ```
    {
        "id": "id of the project to delete"
    }
    ```

    Response format (deleted project data):
    ```
    {
        "id": "id of the project",
        "courseId": "id of the course containing this project",
        "projectName": "name of the project",
        "description": "description of the project",
        "leaderName": "username of the leader",
        "leaderGithubName": "github username of the leader",
        "memberNames": {
            "wrapperName": "Set",
            "values": [
                "username of member"
            ],
            "type": "String"
        },
        "inviteToken": "some invite token",
        "expireTime": "expire time of the token, hard-coded to 24h after token generation"
        "repoName": "some repository"
        "stats": {
            commits: [            
                {
                    "authorDate": "author time",
                    "committer": "committer's github username or profile name",
                    "committerDate": "commit time",
                    "message": "commit message",
                    "author": "author's github username or profile name"
                },
            ],
            "eTag": "a tag helping with update commits history"
        }
    }
    ```
    The `memberNames`, `inviteToken`, `expireTime`, and `stats` fields might not exist.

* PUT /project/github-state

    Push a message that will send a request to github API and update the `stats` field (commit history) of a project. This message will be asynchronously consumed by AWS SQS later. This message should be called whenever the `stats` field data is used to render tables, graphs, or statistics.
    
    Request body format:
    ```
    {
        "id": "id of the project to update",
        "accessToken": "the access token used to call github api, should be the signed in user's token"
    }
    ```

    Response format:
    ```
    {
        "messageId": "id of the message pushed into AWS SQS"
    }
    ```

### course

* GET /course

    Find a list of course data given search criterion.

    URL query parameters:

    * id: Id of the course to be found
    * instructor: Username of the instructor who creates the course
    * inviteToken: Token contained in a invitation link. It will uniqely identify a course

    Only one of the above three parameters should be supplied. If no parameter is supplied, return all projects data.

    Response format:

    ```
    [
        {
            "id": "id of the course",
            "courseName": "name of the course"
            "description": "description of the course",
            "instructor": "username of instructor",
            "projects": {
                "wrapperName": "Set",
                "values": [
                    "id of project created under the course"
                ],
                "type": "String"
            },
            "inviteToken": "some invite token",
            "expireTime": "expire tiem of the token, hard-coded to 24h after token generation",
        }
    ]
    ```
    The `projects`, `inviteToken`, and `expireTime` fields might not exist.

* POST /course

    Create a new course.

    Request body format:

    ```
    {
        "courseName": "name of the course",
        "description": "description of the course"
        "instructor": "username of instructor",
    }
    ```

    Response format:
    ```
    {
        "id": "system-generated unique id for this course"
        "courseName": "name of the course",
        "description": "description of the course",
        "instructor": "username of instructor",
    }
    ```

* PUT /course

    Update partial course data.

    Request body formats (choose only one of the following):
    * Update miscellaneous course information
        ```
            {
                "id": "id of the course to update",
                "courseName: "name of the course",
                "description": "description of the course",
                "instructor": "username of instructor"
            }
        ```
        While some other fields are allowed to be updated via this method, changing them might result in unexpected behavior, so please only include the above three fields for this type of query.
    * Add a project to course `projects`
        ```
        {
            "id": "id of the course to update",
            "projectsAdd": "id of the project to be added"
        }
        ```
        This request is for internal development convenience only. It should not be used and will not be helpful since once a project is created, it is automatically added into corresponding course `projects`. Most importantly, this method will not change the `courseId` field of the added project.
    * Delete a project from course `projects`
        ```
        {
            "id": "id of the course to update",
            "projectsDelete": "id of the project to delete"
        }
        ```
        Similar to the above, this request is also for internal development convenience only.
    * Generate invite token of a project
        ```
        {
            "id": "id of the course to update",
            "inviteToken": "any nonempty string will suffice"
        }
        ```
    
    Response format (updated course data):
    ```
    {
        "id": "id of the course",
        "courseName": "name of the course"
        "description": "description of the course",
        "instructor": "username of instructor",
        "projects": {
            "wrapperName": "Set",
            "values": [
                "id of project created under the course"
            ],
            "type": "String"
        },
        "inviteToken": "some invite token",
        "expireTime": "expire tiem of the token, hard-coded to 24h after token generation",
    }
    ```
    The `projects`, `inviteToken`, and `expireTime` fields might not exist.

* DELETE /course

    Delete a course. It will also remove all projects created under this course, so one does not need to remove those trash projects after this request.

    Request body format:
    ```
    {
        "id": "id of the course to delete"
    }
    ```

    Response format (deleted course data):
    ```
    {
        "id": "id of the course",
        "courseName": "name of the course"
        "description": "description of the course",
        "instructor": "username of instructor",
        "projects": {
            "wrapperName": "Set",
            "values": [
                "id of project created under the course"
            ],
            "type": "String"
        },
        "inviteToken": "some invite token",
        "expireTime": "expire tiem of the token, hard-coded to 24h after token generation",
    }
    ```
    The `projects`, `inviteToken`, and `expireTime` fields might not exist.