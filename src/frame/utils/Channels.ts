import {Channel} from 'frame/models/Channel';

export class Channels {

  public static readonly EMAIL = new Channel({
    id: 'email',
    name: 'Email',
    icon: 'https://cdn.ayro.io/email-channel.png',
    connected: false,
  });

  public static get(channel: string): Channel {
    return Channels.channels[channel];
  }

  private static readonly channels = {
    email: Channels.EMAIL,
  };
}
