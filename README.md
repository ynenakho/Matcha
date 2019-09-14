# Matcha Dating Website

## Technologies Used

NodeJS Express React Redux MaterialUI

## App Deployed at

https://matcha-sv.herokuapp.com/

## Goal

`1 Registration and Signing-in`

The app must allow a user to register asking at least an email address, a username, a last
name, a first name and a password that is somehow protected. After the registration, an
e-mail with an unique link must be sent to the registered user to verify his account.
The user must then be able to connect with his/her username and password. He/She
must be able to receive an email allowing him/her to re-initialize his/her password should
the first one be forgotten and disconnect with 1 click from any pages on the site.

`2 User profile`

- Once connected, a user must fill his or her profile, adding the following information:<br>
  - The gender.<br>
  - Sexual preferences.<br>
  - A biography.<br>
  - A list of interests with tags (ex: #vegan, #geek, #piercing etc...). These tags
must be reusable.<br>
  - Pictures, max 5, including 1 as profile picture.<br>
- At any time, the user must be able to modify these information, as well as the last
name, first name and email address.<br>
- The user must be able to check who looked at his/her profile as well as who “liked”
him/her.<br>
- The user must have a public “fame rating” <br>
- The user must be located using GPS positionning, up to his/her neighborhood. If
the user does not want to be positionned, you must find a way to locate him/her
even without his/her knowledge. The user must be able to modify his/her GPS
position in his/her profile.

`3 Browsing`

The user must be able to easily get a list of suggestions that match his/her profile.
- You will only propose “interesting” profiles for example, only men for a heterosexual
girls. You must manage bisexuality. If the orientation isn’t specified, the user will
be considered bi-sexual.<br>
- You must cleverly match profiles:<br>
  - Same geographic area as the user.<br>
  - With a maximum of common tags.<br>
  - With a maximum “fame rating”.<br>
- You must show in priority people from the same geographical area.<br>
- The list must be sortable by age, location, “fame rating” and common tags.<br>
- The list must be filterable by age, location, “fame rating” and common tags.<br>

`4 Research`

The user must be able to run an advanced research selecting one or a few criterias such
as:<br>
- A age gap.<br>
- A “fame rating” gap.<br>
- A location.<br>
- One or multiple interests tags.<br>
As per the suggestion list, the resulting list must be sortable and filterable by age,
location, “fame rating” and tags.

`5 Profile of other users`

A user must be able to consult the profile of other users. Profiles must contain all the
information available about them, except for the email address and the password.
When a user consults a profile, it must appear in his/her visit history.
The user must also be able to:<br>
- If he has at least one picture “like” another user. When two people “like” each other,
we will say that they are “connected” and are now able to chat. If the current user
does not have a picture, he/she cannot complete this action.<br>
- Check the “fame rating”.<br>
- See if the user is online, and if not see the date and time of the last connection.<br>
- Report the user as a “fake account”.<br>
- Block the user. A blocked user won’t appear anymore in the research results and
won’t generate additional notifications.<br>
A user can clearly see if the consulted profile is connected or “like” his/her profile and
must be able to “unlike” or be disconnected from that profile.

`6 Chat`

When two users are connected,
they must be able to “chat” in real time. How you will
implement the chat is totally up to you. The user must be able to see from any page if
a new message is received.

`7 Notifications`

A user must be notified in real time6 of the following events:<br>
- The user received a “like”.<br>
- The user’s profile has been checked.<br>
- The user received a message.<br>
- A “liked” user “liked” back.<br>
- A connected user “unliked” you.<br>
A user must be able to see, from any page that a notification hasn’t been read.

`8 Cool features`

- Add Omniauth strategies for the connection.
- Import pictures from Facebook and/or Google+.
- Create an interactive map of the users (which implies a more precise GPS localization via JavaScript).
