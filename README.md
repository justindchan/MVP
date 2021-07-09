### BEAT SHARE 

 - Beat Share is a full stack, single page web application that enables Spotify users to self-discover their own listening history and music tastes.  

 - Utilizing the Spotify API, users login via OAuth2 on the gatekeeper URL and are given a brief description of the app before being taken to the main results page upon successful authentication.

 - Upon successful GET request to Spotify servers, the response object will consist of the piece of data the user is currently interacting with, including track information, album art, current streaming activity, and track prevalence.

 - The first feature on the main page is a button that users can click which will retrieve the currently streaming track ID and album art for the user to view in focus (if there is no currently streaming track on the user's account, the app will get a response object wil null values and will display a message notifying the user instead of rendering the art and track ID).

 - There are three time periods that users can choose from: 4 weeks from present, 6 months from present, and two years from present.  Users select which time period to view, via easy tab selection, and the most played tracks from within that time period is then shown to the user.  Users may toggle between each time period at will.  Each tab includes the top 50 most played songs from each time period, ordered from most prevalent to least prevalent. 

 - Finally, after browsing their results, users may decide to share their results as a Spotify Playlist.  Upon clicking a button in the top nav bar, the app will bundle the results of the currently selected tab into a POST request to the Spotify API.  On the user's Spotify account, a new playlist will be created consisting of all the songs from the selected time period.  The user can then treat this playlist like any other user created Spotify Playlist.   

## DEV SCRIPTS:

- Auth Server start: npm start in server dir

- Client start: npm start in client dir

- DEV URL: localhost:8888 -> authenticates and redirects to localhost:3000

## ROAD MAP FEATURES:
Spotify api application 2.0a
 - logout function - DONE
 - fix scroll behavior when not playing - DONE
 - cleanup buttons - DONE
 - ADD SPOTIFY LOGO ASAP
 - back to top button when scrolled past main
 - play button on track results
 - widget player in navbar 
 - if temp token expires during session, redirect to login screen instead.
 