// Dash.jsx
import React from 'react';
import Card from 'react-bootstrap/Card';
import { ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Import Link dari React Router
import '../dashboard.css';
import Logo from '../../public/navbar-brand.svg';
import JadwalPelatihan from './com-pelatihan';

function Dash() {
  return (
    <div >
      {/* Logo dan tulisan Politeknik Negeri Banyuwangi */}
      <div className='logo-container'>
        <img
          src={Logo} // Gantilah dengan path sesuai lokasi logo Anda
          alt="Politeknik Negeri Banyuwangi"
          className='poltek-logo'
        />
      </div>
      <div className='card-container'>
      <Card
          className='card-name'
          style={{
            width: '19rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '25px',
            marginRight: '10px',
            position: 'relative', // Menambahkan properti position relative agar posisi absolut bisa berada di dalamnya
          }}
        >
          {/* Frame bulat dengan foto */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              overflow: 'hidden',
              position: 'absolute',
              top: '-40px', // Menyesuaikan tinggi foto agar setengah lingkaran
              left: '50%',
              transform: 'translateX(-50%)',
              border: '2px solid #fff', // Tambahkan garis putih sebagai frame
            }}
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMkAAAD7CAMAAAD3qkCRAAABVlBMVEX4sTMAS3T4uowAAAABOVncpngASXX4uo78tDT4sTD8vY4ASnX9szH/uDUANlkAR3ZJUFTTlyvqqzUANFp2a0z4uon4tmkPCwRfRzYZEgX4uHjwrUjep3MBPV//ti7oroP4sjv4s0YARHcATnH4uYN4VhmbbyDlrIF4WkS/j2yUb1TPm3X4t3AARGrcnS3qpzC4hCZONxDGjikxIwpKNQ9sTRZaQBONZR2wfSQsIRmBXBpsUT1CMSWjelwmHBUrIBiCYUn4tVqpi3CYhG66lUkSUm/VoUDepzglGwhkRhUsIAk6KQxRPS2yhmVwVD8ZEw7GmUmKeUdlX0/Gm3VaXlzImjoZP1dIWmMgSV6Id2pkZGQ4T19wa2aliW+MfGw6U1iyj0wuXGp5dV5eaGabikxgcV1GZ2KKfFoqWWvTojxebGOMg1JOamBkc1tycWGri1IrX2d7fVWphFdZAAALXElEQVR4nO2d61vayhbGEyQhCUGOeLzUKlBQUamg1EutYm0L2m61tduivbj38Vpvta3//5czCRBCEpKQzC19fD9uQ5yfa941a62hz2aYBz3oQQ960IMe9CAPEvQivRhvUldeLBQKfU0VCsVi4HiEmFAozT2fnFha2B5q6O3C/MSLyblSXzEWFBohxpQmXyw9G+qx0tuFxeXnhVgAWIRYaWL+mSWEpkcLi88ZumGAMyYf2VNoWiww1LIITN+ySwxVS6UinSxC37LbeGhxmaMwLkJxcqFLDqChib4Y6ZUbJJSWrHOVk7YnqQqLIEx6wlD1rkAPilBc9A4CknKJGpS+eT8gQHOkCRoqebC6QZOkGRTF+hxOdDcaogBFKPjnUEQcRSj8BYek5zlZ2wsFv2ZviWwGK05AA+n5q48kio8D0axFcgWl0AcThKjrt+GS9MwRCoqfYstaS0UyIH3dtiPOmiQTFIh5SxOJoAhzbxGQTBBovGAeJTrhPx+FOW89opMWcYMw/pqrztrGHRRYJbBZy3hBGAGNS4AWcJdfqEBwl/cx6Md7S++wnimC/9a9s3BuLxSFSks4S+JYV5NsS62tdfzRNkYSZskvyHBOkso7H6x/iG8oKZQ6DYZWpnZcgUxxUigkSbvDlj9dxlZ8dcxcK9NSfmbFkWN9JgVAgKTcjNXPF/CVkS+sV7iWl0JSKF92iMvqdKgpEBaLHTaEKw93Gg2t1f/SUiiVm+ns5+F8IyANlmmLShRXFyyULHPwVERq/aklKVd+v7Oy/mGotdChDy93wL7Sc6go66ZX4epShOeWIKn2JUoqznS5vLHxfnV1dWpjppwPGTHUB3dN71rCA8KkrU4TkFbNi2zwaLJ6AjyzYXzZNqZjvvjODLJuDeJSRte/xWMUoWDRwOf9gEjTxtfhmbFYNVllPyBAxhNyGQ9JyQSyGvEHYgrKBJ4TxWT4dV97S1Futf2NS3hKL5PhN3xygKCU29/4DM9cwniL9XLab0hCUr69KHiEJ3kZy4tV3yEBet/+Tjwkxs014zskICiGohjLWKJo9Lv/zaUYpT3SODpgYc5AspLyD2KqI19gSMMmkjUIIQGWb2/QcIyKYsY2awcFyXwBPYlgJBmGQmLYXfMYjsaYcSIMh6TcXg8/w0FibH3hkBiy8BAOEuMgFQ7Jxp9Ckhr+Q0iMdReWMTcakumXBEiMk9QpGCSm+QoOEuOwC0oBSQWJ3x6+TmIcr5AggVJAEnG8geQ9jCRsysIESIZhhMRiDomdZMX3WKVBYjQKDhKQrXKp1Ht4dleVaxplbTqV28BDMqxM3KXQTH1vwSKRmhOvKWUqnhpGTyI+CdUXr0yohqCFpDWGVI8nKf9YRE2SHtH95jU4dq+rR79fIyOoQcRXAzqSDWghAS+s5+H13fo7I8iD8jSiI+FgkuTrhm8mwxG0JOKTce0Xr/V8gAgCpGavHW3DptGSNDdXSOJ2oFTBOqlT7lXtna+QBkV8pd2UpFZ7YAwfW5Lyyhiy9dcZRLu9BjWSyAaU2lGn1FSPvkd4iotEmoFNojQpQ604I7a8jqQ87PNOzkQCrPehdYc8jo/E/1WWEWWmZ6VlPXwku2XoJPmXuiEzvt01nYdNAs55Xd+G1vG6LCzlc/BJdnUlKdos3DoZ0QvxyahVK+iVRgmiFPWQU29HDSCuhcVBTCARxEc8PqOg70/SmIwykEYMgmt7RQZRgygTCSxCP5FgRBzZKzKSRg4CgoKBZADtsdgU+qBgCYkSFOSJeACDS1ShTl8RxC28JhFxyYJpb6koSOvIyMATTCFRUNLjyKISGccIAlCYwfERFMYfGR9M4wRRWERmBD5IRBQxc6hCQkKAA0nZgngy9OeTwD8gkTeK+EhwHe4GEviNcARPCWwieQyfBOuh2FL6jyFhoJOMp8mAiLDrSIxFsIEE9oESGSRFMgib5BUZEJC8oJMQMjyThkyCtzPRS4QLEiJleMXyUEEiT0mBwLY8oapLJXkFlQTT4NGSBO60m5zhYd/VIf+anZ2gGoWcTSAX9gRtwsDdXujv4+wEsW8k1MO3BO1wJNZlNQTNKRHEXx1ygQIpfeEc0HcSlKBguLV2FJwuZYSCkEC5rCN7ljQlpv3nLwr2liLfl3WRp2nSDA35TMWRcdzXWJ3lz/Ukq3mT/MztqQJRULxusHFc34dwLW8okXFS0zobPfUCQkORYpSnBEaZR+oSH492/a84aIyISsJ1iZIafUJ61VZSSLiuvmqf4igm6QYlx1FNwnFuQZRn6SZxZ5YUVyeh1fF1udhhjSdpJJFlZo/T5BCWlPbgXiIpk156u8Tax79/5lsodmFpcXD7nz59rJFee5uSfx+E+w91JDZh0T+0/60/fHCZIL18nZL/6Q/3Hu5znCNLru2R1996w/3/pYukNxzu/fzGgSVl4PjyGXyMQhKwqM9Hr9vWmkulbDgO+pVPUUkC4nLw9Q1nhAE4qVT7f+XefP3cW/8MpSTh3t6DwzfcKGenUe7Nt3Bv8xO0kigw/Qdf8jYg+41tRT+JynK0b42Rf3100K9/lm4SdZMd/WMOTP4fIwf1JCqLwfyj3L+fDkzP0U+iJrJv/2rmH+W+AJtbPBUEEgUmfNSw+VErW5lI6CkihY4kYKHho939/a9hoz1asP87vmZkKqp7Wdz89bkjCWA5OLTcVk2NxU8uK1sy6cCIcqxyesiO2aw0bMsBSFg+Xj27rBHtVIRk4vywyvNRexJ7jbEsG+XZ6tmxmCTzP5oUmPTmBQswwErYWa8sY7NsXVGez95dp0XcMKKc3jz+nolHWU0eYDSMBkw88/14M43T/mBXVS6v4jzbrtmxbmDGZmdZk/j4FbB/EhOLLF9/vKmaOLoLzJgFRp0lUz0735IxbDI5Wbs7Yfloh4W4g+mEUd9kfPbk7hpxKgNRr3znectwuGbpGA4dC8//rjDI3C/Kic3bq4wDhgOMM0YTJnNyvsmgCAzg2Dt1yaGyWMBYmryjFPfXoBdlorz162c13tkdljBjnsKhY8mcnO6JMFlA1r0/zNq43Bmme4w6S7R6cwzN/IK4dZ+NeuFQNeadQxH4xb/3BAgHjCgkNi/iXW4rg7xj1MVnbvz7RU5UTvm4z5X4Vzx7WvNVxMiJ45usv3hAUjRz8nHLc1jEZO2s6tkesMWzZzVvKCDvXnhKV6gEiphzLztMTJzTsa90imZuvYCcZijjYJWweEA5zZBetpX46l6XXkmes/RFRBH/M9GVVeTrQ9eVIl5Fs10G5ZT8YdhB8ZtugiLXrigNiRKUzW76r1tqQVg2c+s+JuLWCcUk0ar7mAh7VGbgpjLXrlHEH9T6XVH8LukWJEFTtWUWX3Wbh+VjqjcXOLJrLrdX8gfFfld16zYoVao3l1KxuDOKXKG05NLEH265OlKSp5SDgBOl4m57ndFuExb0ji44BIprrqb4SzcRkY9pNzwguXFjFPmSehCWP3FzoiR+Ul2qqIpmXVheoLZb1Cv+y3l3yXv02wSQuPhmrnxM/+ZyZ/n0ZSBIrhx7FDFxEQCbuGnmxa3fQSBhM3tOu0vYpL18rCt+7mQTme4WXlP8zomEOQ8GCf/bkeQiCKlLKewdSb4HwvDA8o4z1WwgDA9IHG7qxEQwbAJIHJotuRIUkvi9A0lAUhdIXj/s5yvJu2CkLqXZciAJSuoClZcDSRCaE1VR1j4Ni8GoulTZ1vVCLTgkUds0LFdIr8+9HEjOAxMSNnpvZ/nkfXBIeNubLfqH2y3xZ7YkQZh1NcQf2pYrgSKxGRQJ1/SP6TXZDoqCcOGgKXplMxuWK4EpVhwutoJwdaIpanexJd9mSa+vC2Vt7rLlW9Kr60o2JMnL4BheuXnofDQmAzGnb8pA8n8sDMr0zQNxGwAAAABJRU5ErkJggg=="
              alt="User Avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Nama di bawah foto */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <p style={{ margin: '0', fontSize: '1.2rem' }}>Alvin Sugiarto S.Tr.Kom</p>
          </div>

          {/* Konten lainnya di dalam Card.Body */}
          <Card.Body style={{ marginTop: '40px' }}>
            <Card.Title style={{ textAlign: 'center' }}>Card Title</Card.Title>
            <Card.Text style={{ textAlign: 'center' }}>
            
            </Card.Text>
          </Card.Body>
        </Card>
        <br />
        <br />
        {/* Card Menu */}
        <Card
          className='card-menu'
          style={{
            width: '19rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '25px',
          }}
        >
          <Card.Body>
            <Card.Title style={{ textAlign: 'center' }}>Menu</Card.Title>
            <ListGroup variant='flush'>
              <ListGroup.Item as={Link} to="/">
                <FontAwesomeIcon icon={faUser} className='mr-2' />
                &nbsp;
                &nbsp;
                Pendaftaran
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/jadwal-ujian">
                <FontAwesomeIcon icon={faCalendarAlt} className='mr-2' />
                &nbsp;
                &nbsp;
                Jadwal Ujian
              </ListGroup.Item>
              <ListGroup.Item as={Link} to="/jadwal-pelatihan">
                <FontAwesomeIcon icon={faClock} className='mr-2' />
                &nbsp;
                &nbsp;
                Jadwal Pelatihan
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
      <div >
      <JadwalPelatihan />
      </div>
    </div>
  );
}

export default Dash;
