import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDisclosure,
  Input,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Select,
  Alert,
  AlertTitle,
  AlertIcon,
  CloseButton,
} from '@chakra-ui/react';
import './createChannel.scss';
import * as actions from '../../../store/actionCreators';
import { OnClickRoute } from '../../../helpers/onClickRoute';
import { createChannel, getChannels, getAllChannels } from '../../../helpers/apiClientServer';

interface Props {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  closeChannels: () => void;
}

const CreateChannel: React.FC<Props> = ({
  showModal,
  setShowModal,
  closeChannels,
}) => {

  const navigate = OnClickRoute();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const user = useSelector<State, User>((state: State) => state.user);
  const [error, setError] = useState<boolean>(false);
  const [options, setOptions] = useState({
    name: '',
    parentId: '',
    isPrivate: false,
  });

  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
    setShowModal(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setOptions((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filteredResult = allChannels.filter((chan) => 
      chan.name.toLowerCase() === options.name.toLowerCase());

    if (filteredResult.length) {
      console.log('channel already exists');
      setError(!error);

    } else if (options) {
      createChannel(user.id, options)
        .then((newChannel) => {
          dispatch(actions.addChannel(newChannel));
          navigate(`channels/${newChannel.name}`);
          onClose();
          closeChannels();
        });
            
      setOptions({
        name: '',
        parentId: '',
        isPrivate: false,
      });
      setError(!error);
    }
  };

  useEffect(() => {
    if (showModal) onOpen();
  }, [showModal, onOpen]);

  useEffect(() => {
    getChannels().then((channelsReq) => {
      setChannels(channelsReq);
    });
    
    getAllChannels().then((allChannelsReq) => {
      setAllChannels(allChannelsReq);
    });
  }, []);

  return (
    <div className="create_channel">
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="lg">
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader>Create a channel</DrawerHeader>
            <DrawerCloseButton onClick={() => handleClose()} />
            <form onSubmit={handleSubmit}>
              <DrawerBody>
                Channel Title
                <Input
                  className="search_input create_channel_form"
                  id="channel_title"
                  type="text"
                  placeholder="#"
                  name="name"
                  onChange={handleChange}
                  value={options.name}
                />
                <Select
                  className="create_channel_form"
                  name="isPrivate"
                  onChange={handleChange}
                  placeholder="Public"
                  value={options.isPrivate.toString()}
                >
                  <option value="true">Private</option>
                </Select>
                <Select
                  className="create_channel_form"
                  name="parentId"
                  onChange={handleChange}
                  placeholder="Genre"
                  value={options.parentId}
                >
                  {channels &&
                    channels.map((channel: Channel, i: number) => (
                      <option key={channel.id} value={channel.id}>
                        {channel.name}
                      </option>
                    ))}
                </Select>
              </DrawerBody>

              {
                error &&
                <Alert status="error">
                  <AlertIcon />
                  <AlertTitle mr={2}>This channel already exists!</AlertTitle>
                  <CloseButton position="absolute" right="8px" top="8px" />
                </Alert>
              }

              <DrawerFooter>
                <button className="genre_tag_button channel_btn" type="submit">
                  Create
                </button>
              </DrawerFooter>
            </form>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </div>
  );
};

export default CreateChannel;
