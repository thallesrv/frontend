import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import { MdInsertDriveFile } from 'react-icons/md';
import { distanceInWords } from 'date-fns';
import pt from 'date-fns/locale/pt';
import api from '../../services/api';
import socket from 'socket.io-client';


import logo from '../../assets/logo.svg';
import './styles.css';

// import { Container } from './styles';

export default class box extends Component {
    state = {
        box: {}
    };

    subscribeToNewFiles(){
        const box = this.props.match.params.id;
        const io = socket.connect('https://tbox-backend.herokuapp.com');

        io.emit('connectRoom', box);
        io.on('file', (data) => (
            this.setState({box : {...this.state.box, files : [data,...this.state.box.files] } })
        ));
    }

    async componentDidMount(){
        this.subscribeToNewFiles();

       const box = this.props.match.params.id;
       const response = await api.get(`boxes/${box}`);

       this.setState({box : response.data});
    }

    handleUpload = async (files) => {
        const box = this.props.match.params.id;

        files.forEach(file => {
            const data = new FormData();

            data.append('file', file);

            api.post(`/boxes/${box}/files`, data);
        });
    }

    render() {
        return (
           <div id="box-container">
                <header>
                    <img src={logo}></img>
                    <h1>{this.state.box.title}</h1>
                </header>

                <Dropzone onDropAccepted={this.handleUpload}>
                    {({getRootProps, getInputProps}) => (
                        <div className="upload" {...getRootProps() }>
                            <input {...getInputProps() } />

                            <p>Arraste arquivos ou clique aqui</p>
                        </div>
                    )}
                </Dropzone>

                <ul>
                    {this.state.box.files && this.state.box.files.map( file => (
                            <li key={file._id}>
                                <MdInsertDriveFile size={24} color="#A5EFFF" />
                                <a href={file.url}>{file.title}</a>
                                <span>á {distanceInWords(file.createdAt, new Date(), {
                                    locale: pt
                                })}</span>
                            </li>
                    ))}
                </ul>
           </div>
        );
      }
}
