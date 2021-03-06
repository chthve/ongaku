import React, { useEffect, useState } from 'react';
import './discover.scss';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import GenreTags from './GenreTags/GenreTags';
import {
  getChannels,
  subscribeToChannels,
} from '../../helpers/apiClientServer';
import { addChannel } from '../../store/actionCreators';

const Discover: React.FC = () => {
  const dispatch = useDispatch();
  const [defaultChannels, setDefaultChannels] = useState<Channel[] | null>(
    null
  );
  const [subscribed, setSubscribed] = useState<ChannelForDb[]>([]);
  const user = useSelector<State, User>((state: State) => state.user);

  const handleClick = (id: string, genre: string) => {
    setSubscribed((prevState) => {
      if (prevState.find((channel) => channel.id === id)) return prevState;
      return [...prevState, { id, name: genre }];
    });
  };

  const handleSubmit = () => {
    if (user.id !== 0)
      subscribeToChannels(user.id, subscribed).then((resp) => {
        resp.forEach(async (channel: Channel) => {
          dispatch(addChannel(channel));
        });
      });
  };

  useEffect(() => {
    getChannels()
      .then((channelsReq) => {
        setDefaultChannels(channelsReq);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        gsap
          .timeline()
          .from('.li0', { opacity: 0, duration: 0.2 })
          .from('.li5', { opacity: 0, duration: 0.2 })
          .from('.li1', { opacity: 0, duration: 0.2 })
          .from('.li6', { opacity: 0, duration: 0.2 })
          .from('.li2', { opacity: 0, duration: 0.2 })
          .from('.li7', { opacity: 0, duration: 0.2 })
          .from('.li3', { opacity: 0, duration: 0.2 })
          .from('.li8', { opacity: 0, duration: 0.2 })
          .from('.li4', { opacity: 0, duration: 0.2 })
          .from('.li9', { opacity: 0, duration: 0.2 });
      });
  }, []);

  return (
    <div className="discover_container">
      <div className="discover_header">
        {user.username ? (
          <h3>
            Welcome <br /> {user.username}
          </h3>
        ) : (
          <h3>Welcome</h3>
        )}
      </div>
      <div className="discover_title">
        <h4>Discover your channels...</h4>
      </div>

      <div className="genre_container">
        <ul className="genre_list">
          {defaultChannels &&
            defaultChannels.map((channel: Channel, i: number) => (
              <li className={`li${i} genre_list_item`} key={channel.id}>
                <GenreTags
                  handleClick={handleClick}
                  genre={channel.name}
                  id={channel.id}
                />
              </li>
            ))}
        </ul>
      </div>
      <div className="discover_next">
        <Link to="/dashboard">
          <button
            className="genre_tag_button two"
            type="submit"
            onClick={handleSubmit}
          >
            Next
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Discover;
