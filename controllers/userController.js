exports.addUserController = (req, res, next) => {
    //set profile user and password
    let user = req.body.user;
    let password = req.body.password;
    let phoneNumber = req.locals.phoneNumber ? req.locals.phoneNumber : req.body.phoneNumber;
    let profile = req.body.profile;
    let amount;

    switch (profile) {
        case profile_2mbs: {
            amount = 2000;
            break;
        }
        case profile_4mbs: {
            amount = 3000;
            break;
        }
        case profile_5mbs: {
            amount = 4000;
            break;
        }
        case profile_6mbs: {
            amount = 5000;
            break;
        }
    }

    //send stk prompt
    let oauth_token = "B8wgx4As1CX2e0OxU4Qujpufkis5";
    let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    let auth = "Bearer " + oauth_token;

    request(
        {
            method: 'POST',
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "BusinessShortCode": " ",
                "Password": " ",
                "Timestamp": " ",
                "TransactionType": "CustomerPayBillOnline",
                "Amount": `${amount}`,
                "PartyA": `${phoneNumber}`,
                "PartyB": " ",
                "PhoneNumber": `${phoneNumber}`,
                "CallBackURL": "https://intenet.ppis.co.ke/",
                "AccountReference": `Pay PPiS Ksh ${amount}/= for internet registration.`,
                "TransactionDesc": " "
            }
        },
        function (error, response, body) {
            // TODO: Use the body object to extract the response
            console.log(body)
        }
    )

    let device = new Mikronode('3.14.18.176');

    device.connect()
        .then(([login]) => {
            return login('admin', '2fpLxthn!');
        })
        .then(function (conn) {

            chan.on('done', function (data) {

                // data is all of the sentences in an array.
                data.forEach(function (item) {
                    console.log(item.data);
                });

                chan.close(); // close the channel. It is not autoclosed by default.
                conn.close(); // when closing connection, the socket is closed and program ends.

            });

            chan2.on('done', function (data) {

                // data is all of the sentences in an array.
                data.forEach(function (item) {
                    console.log(item.data);
                });

                chan.close(); // close the channel. It is not autoclosed by default.
                conn.close(); // when closing connection, the socket is closed and program ends.

            });

            let chan = conn.openChannel("adduser", true); // open a named channel, turn on "closeOnDone"

            chan.write(`/tool/user-manager/user/add/customer=admin/disabled=no/name=${user}/password=${password}/shared-users=1`);
            chan2.write(`/tool/user-manager/user/create-and-activate-profile/customer=admin/profile=${profile}/${user}`);


        });
    res.render('adduser', { title: 'CHR | Register' });
}

exports.upgradeUserController = (req, res, next) => {
    //clear active profiles
    let user = req.locals.user; //get logged in user somehow
    let currentProfile = req.locals.profile;
    let profile = req.body.profile;

    let device = new Mikronode('3.14.18.176');

    device.connect()
        .then(([login]) => {
            return login('admin', '2fpLxthn!');
        })
        .then(function (conn) {

            chan.on('done', function (data) {

                // data is all of the sentences in an array.
                data.forEach(function (item) {
                    console.log(item.data);
                });

                chan.close(); // close the channel. It is not autoclosed by default.
                conn.close(); // when closing connection, the socket is closed and program ends.

            });

            chan2.on('done', function (data) {

                // data is all of the sentences in an array.
                data.forEach(function (item) {
                    console.log(item.data);
                });

                chan.close(); // close the channel. It is not autoclosed by default.
                conn.close(); // when closing connection, the socket is closed and program ends.

            });

            let chan = conn.openChannel("adduser", true); // open a named channel, turn on "closeOnDone"

            chan.write(`/tool/user-manager/user/clear-profiles/${user}`);
            chan2.write(`/tool/user-manager/user/create-and-activate-profile/customer=admin/profile=${profile}/${user}`);


        });
    //assign new profile
}

exports.signUpController = (req, res, next) => {

}