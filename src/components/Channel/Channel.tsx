import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { GiHamburgerMenu, GiTeapotLeaves } from 'react-icons/gi';
import {
  IconButton,
  useDisclosure,
  Button,
  Container,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import SideBar from '../Dashboard/SideBar/SideBar';
import vinyl from '../../assets/vinyl.jpg';
import CreatePost from '../CreatePost/createPost';
import Postcard from '../PostCard/Postcard';
import * as actions from '../../store/actionCreators';
import { getChannel, removePost, subscribeToChannels, unsubscribeFromChannel } from '../../helpers/apiClientServer';
import './Channel.scss';
 
interface Props {
  name: string;
}

const Channel: React.FC<Props> = ({ name }) => {

  const dispatch = useDispatch();
  const history = useHistory();
  const [showSideBar, setShowSideBar] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const channel = useSelector<State, Channel>((state) => state.currChannel);
  const [posts, setPosts] = useState<Post[] | []>([]);
  const [users, setUsers] = useState<number | null>(null);
  const currUser = useSelector<State, User>((state) => state.user);
  
  useEffect(() => {
    if (channel.id) {
      getChannel(channel.id).then((result: ChannelAndUsers) => {
        setPosts(result.channel.posts);
        setUsers(result.users);
      });
    } else {
      history.push('/dashboard');
    }
  }, [channel, history]);
  
  function deletePost(postId: string, userId: number) {
    removePost(postId, userId).then(() => {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    });
  }
  
  function handleSubscribe() {
    const result = currUser.channels.filter((chan) => 
      chan.id === channel.id).length;
    if (result) {
      unsubscribeFromChannel(currUser.id, channel);
      dispatch(actions.unsubscribeChannel(channel));
    } else {
      subscribeToChannels(currUser.id, [channel]);
      dispatch(actions.addChannel(channel));
    }
    
  }

  return (
    <div className="container">
      <nav className="header">
        <img src={vinyl} alt="vinyl_image" />
        <div className="channel_title">@{name.toUpperCase()}</div>
        <div className="welcome_user">
          <IconButton
            className="button_emoji"
            aria-label="burger-icon"
            backgroundColor="inherit"
            size="lg"
            icon={<GiHamburgerMenu />}
            type="button"
            ref={btnRef}
            onClick={() => {
              setShowSideBar((state) => !state);
            }}
          />
        </div>
        <div className="dashboard_info">
          <h3>{users && `${users} Members`}</h3> <h3>{posts.length} Posts</h3>
        </div>
        <SideBar setShowSideBar={setShowSideBar} showSideBar={showSideBar} />
      </nav>

      <Container display="flex" justifyContent="center">
        <Container className='channel_btn_container'>
          <Button
            backgroundColor="#065dc2"
            className="genre_tag_button channel_btn"
            onClick={handleSubscribe}
          >
            {
              currUser.channels.filter((chan) => 
                chan.id === channel.id).length
                ? 'unsubscribe'
                : 'subscribe'
            }
           
          </Button>

          <Button
            backgroundColor="#0f0e0e"
            className="genre_tag_button channel_btn"
            onClick={onOpen}
          >
            + Create Post
          </Button>
        </Container>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent backgroundColor="#f0f1ef" w="97%">
            <ModalCloseButton />
            <ModalBody>
              <CreatePost />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>

      {!(posts.length) ? (
        <div className='empty_channel'>Be the first to post</div>
      ) : (
        <Container position="relative" top="150px">
          {posts
            .sort(
              (
                a: { createdAt: string | number | Date },
                b: { createdAt: string | number | Date }
              ) =>
                new Date(b.createdAt).valueOf() -
                new Date(a.createdAt).valueOf()
            )
            .map((post) => (
              <Postcard key={post.id} post={post} deletePost={deletePost} />
            ))}
        </Container>
      )}
    </div>
  );
};

export default Channel;
