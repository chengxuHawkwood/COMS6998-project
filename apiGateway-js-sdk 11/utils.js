/* IMPORTANT: To be able to use the following functions, please include the
following scripts in the html file
<script src="cognito/js/amazon-cognito-identity.min.js"></script>
<script src="cognito/js/config.js"></script> */

/* A helper function that will change a function that receives callback to a 
function that returns a promise */
const promisify = func => {
    return (...args) =>
        new Promise((resolve, reject) => {
            func(...args, (err, result) =>
                err ? reject(err) : resolve(result)
            );
        });
};

// return a promise object resolved to current username
const getUsername = cognitoUser => {
    return promisify(cognitoUser.getUserAttributes.bind(cognitoUser))().then(
        result => {
            const username = result[2].getValue();
            return Promise.resolve(username);
        }
    );
};

/* fetch the list of users with all fields populated: username, userGithubName, 
userGithubProfName, accessToken (empty or with 1 element) given username */
const fetchUserList = (apigClient, username) => {
    const additionalParams = {
        queryParams: {
            username: username
        }
    };
    return apigClient
        .userGet({}, {}, additionalParams)
        .then(result => result.data);
};
