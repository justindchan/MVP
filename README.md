### BEAT SHARE 

 - Beat Share is a full stack web application that enables Spotify users to self-discover their own listening history and music tastes.  

 - Utilizing the Spotify API, users login via OAuth2 and are then taken to the main results page where API data is displayed according to the time period the user specifies. 

 - There are three time periods that users can choose from: 4 weeks from present, 6 months from present, and two years from present.  Users select which time period to view, via easy tab selection, and the most played tracks from within that time period is then shown to the user.  Users may toggle between each time period at will.  Each tab includes the top 50 most played songs from each time period, ordered from most prevalent to least prevalent. 

 - Finally, after browsing their results, users may decide to share their results as a Spotify Playlist.  Upon clicking a button in the top nav bar, the app will bundle the results of the currently selected tab into a POST request to the Spotify API.  On the user's Spotify account, a new playlist will be created consisting of all the songs from the selected time period.  The user can then treat this playlist like any other user created Spotify Playlist.   


## Available Scripts to start app:

- Server start: npm start in server folder

- Client start: npm start in client folder

- DEV URL: localhost:8888 -> authenticates and redirects to localhost:3000

## 
Spotify api application 2.0a