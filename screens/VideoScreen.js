import React from 'react';
import {
	StyleSheet,
	Text,
    TouchableOpacity,
	AsyncStorage,
    View,
} from 'react-native';
import { Video } from 'expo-av';

export default class VideoScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: null,
			user_email: '',
			user_firstName: '',
			user_lastName: '',
			user_team: '',
			user_professor: '',
			user_username: '',
			user_role: 0,
			focusedVideo: null,
			focusedURI: '',
			videoURI: '',
			videoID: ''
		};
	}
	//Called Once on client
	componentDidMount () {
        this._loadInitialState().done();
        console.log(JSON.stringify(this.props, null , 4));
		this.getVideos();
	}
	//componentWillMount is called twice: once on server,
	//and once on client. It is called after initial render
	//when client receives data from server and before the 
	//data is displayed to browser.
    _loadInitialState = async () => {
        try {
			var value = await AsyncStorage.getItem('user');
			var focusedVideo = await AsyncStorage.getItem('focusedVideo');
			var focusedURI= await AsyncStorage.getItem('focusedURI');
            if (value !== null && focusedVideo !== null && focusedURI !== null) {
                //This Controls switch navigator's state
                var userJSON = JSON.parse(value);
                this.setState({user_id: userJSON.id});
                this.setState({user_email: userJSON.email});
                this.setState({user_firstName: userJSON.first_name});
                this.setState({user_lastName: userJSON.last_name});
                this.setState({user_team: userJSON.user_team});
                this.setState({user_professor: userJSON.professor});
                this.setState({user_username: userJSON.username});
				this.setState({user_role: userJSON.user_role});
				this.setState({focusedVideo: focusedVideo});
				this.setState({focusedURI: focusedURI});

				var focusedVideoJSON = JSON.parse(focusedVideo);
				console.log("Video: " + JSON.stringify(focusedVideoJSON, null, 4));
				this.setState({ videoID : focusedVideoJSON.id });
				this.setState({ videoURI : focusedVideoJSON.link });
            }
        }
        catch (error) {
            console.log(error);
        }


    }

	getVideos = () => {
		// fetch('http://10.0.2.2:3000/getAllDBVideos', {
		// 	method: "GET",
		// 	headers: {
		// 		"Accept": "application/json",
		// 		"Content-Type": "application/json",
		// 	}
		// })
		// .then((response) => response.json())
		// .then((res) => {
		
		// 	if(res.success) {
        //         //Make videos available to component for display render.
        //         console.log("Type: " + JSON.stringify(res.success));
        //         this.setState({videos: res.success});
		// 	}

		// 	else {
		// 		alert("getVideos" + res.error);
		// 	}
		// })
		// .done();
    }
    
    goBack = () => {
		AsyncStorage.removeItem('focusedVideo');
        this.props.navigation.navigate('App');
    }

	handleVideoMount = ref => {
		this.player = ref;
	};

	render() {
		return (
			<View style={styles.container}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={this.goBack}
                >
                    <Text>Go Back</Text>
                </TouchableOpacity>

				<Text>{JSON.stringify(this.state.focusedURI) }</Text>
				<Text
				style={styles.videoTitle}
				>
					{ this.state.videoURI }
				</Text>
				<Video
				id={this.state.videoID}
				source={{ uri : this.state.videoURI }}
				rate={1.0}
				volume={1.0}
				isMuted={false}
				ref={this.handleVideoMount}
				useNativeControls={true}
				resizeMode="cover"
				style={{ width: 300, height: 200 }}
				/>
			</View>
		);
	}
}

VideoScreen.navigationOptions = {
	header: null,
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#2896d3",
		paddingLeft: 40,
		paddingRight: 40
    },
    videoTitle : {
        color: '#FFFFFF'
    },
    wrapper : {
        flex: 1,
    },
    videoCard: {
        backgroundColor: "#121212",
        flex: 1,
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'space-around',
		marginTop: 10,
		height: 100
    },
    btn: {
		alignSelf: "stretch",
		padding: 20,
		backgroundColor: "#01c853",
		alignItems: "center"
	}
});