import React, { useState, useEffect } from 'react'
import style from './Contact.module.css'
import { functions } from '../../shared/fire'

// components
import Alert from '../../UI/Alert/Alert'
import Spinner from '../../UI/Spinner/Spinner'

//photos images svg
import { ReactComponent as Phone } from '../../assets/phone.svg'
import { ReactComponent as Email } from '../../assets/email.svg'
import { ReactComponent as Location } from '../../assets/location.svg'
import { ReactComponent as Facebook } from '../../assets/facebook.svg'
import { ReactComponent as YouTube } from '../../assets/youtube.svg'
import { ReactComponent as Instagram } from '../../assets/instagram.svg'
import { ReactComponent as ContactUs } from '../../assets/contact_us.svg'
import { ReactComponent as Envelope } from '../../assets/envelope.svg'




const Contact = () => {

    // scroll to top when componene render
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // input Name
    const [inputName, setInputName] = useState('') // input value
    const [inputNameIsInvalid, setInputNameIsInvalid] = useState(false) // only for set isValid/inInvalid before send

    // input Email
    const [inputEmail, setInputEmail] = useState('') // input value
    const [inputEmailIsInvalid, setInputEmailIsInvalid] = useState(false) // only for set isValid/inInvalid before send

    // input Message
    const [inputMessage, setInputMessage] = useState('') // input value
    const [inputMessageIsInvalid, setInputMessageIsInvalid] = useState(false) // only for set isValid/inInvalid before send

    // Alert
    const [isAlertShow, setIsAlertShow] = useState(false)

    // Spinner
    const [isSpinnerShow, setIsSpinnerShow] = useState(false)

    // form animation
    const [isFormAnimation, setIsFormAnimation] = useState(false)

    // click Send
    const sendMessage = event => {
        event.preventDefault()
        // validation 
        let isInvalid = false

        // name validation if is min 3 chars
        if (inputName.trim().length < 3) {
            setInputNameIsInvalid(true)
            isInvalid = true
        } else {
            setInputNameIsInvalid(false)
        }

        //email validation
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(inputEmail).toLowerCase())) {
            setInputEmailIsInvalid(true)
            isInvalid = true
        } else {
            setInputEmailIsInvalid(false)
        }

        // message validation if is min 10 chars
        if (inputMessage.trim().length <= 10) {
            setInputMessageIsInvalid(true)
            isInvalid = true
        } else {
            setInputMessageIsInvalid(false)
        }

        //check if all inputs are valid
        if (isInvalid) {
            return
        }

        //show spinner
        setIsSpinnerShow(true)


        //sent email new function
        const sendEmail = functions.httpsCallable('sendEmail')
        sendEmail({ name: inputName, email: inputEmail, message: inputMessage })
            .then(resp => {

                // turn off spinner
                setIsSpinnerShow(false)

                // turn on animation sent
                setIsFormAnimation(true)
                const okId = document.querySelector('#okId')
                okId.classList.add(style.svgOkIdAnim)

                // clear inputs after 1s when during animation
                setTimeout(() => {
                    setInputName('') // clear input
                    setInputEmail('') // clear input
                    setInputMessage('') // clear input
                }, 1000)

                // clear animation classes after 4s when animations stop
                setTimeout(() => {
                    setIsFormAnimation(false)
                    okId.classList.remove(style.svgOkIdAnim)
                }, 4000)
            })
            .catch(err => {
                setIsSpinnerShow(false) // turn off spinner
                setIsAlertShow(true) // show error alert
            })
    }

    return (
        <section className={style.background}>

            <div className={style.section}>
                <div className={style.head}>
                    <h1 className={style.header}>Skontaktuj się</h1>
                    <p className={style.line}></p>
                </div>
                <div className={style.contact}>

                    {/* contact links  */}
                    <div className={style.content}>
                        <a className={style.contentItem} href={`http://maps.google.com/?q=Gdynia`} target='blank' >
                            <p className={style.contentIcon}><Location /></p>
                            <p className={style.contentDesc}>Poland, Gdynia, ul. ????</p>
                        </a>
                        <a className={style.contentItem} href='tel:+48530064809'>
                            <p className={style.contentIcon}><Phone /></p>
                            <p className={style.contentDesc}>spec. ds. reklamy i rozwoju:<br />+48 530-064-809</p>
                        </a>
                        <a className={style.contentItem} href='tel:+48795631039'>
                            <p className={style.contentIcon}><Phone /></p>
                            <p className={style.contentDesc}>spec. ds. technicznych:<br />+48 795-631-039</p>
                        </a>
                        <a className={style.contentItem} href='mailto:info@jatestuje.pl?subject=Zapytanie dot. jaTestuje.pl'>
                            <p className={style.contentIcon}><Email /></p>
                            <p className={style.contentDesc}>info@jaTestuje.pl</p>
                        </a>
                        <a className={style.contentItem} href='http://jatestuje.pl' target='blank' >
                            <p className={style.contentIcon}><Facebook /></p>
                            <p className={style.contentDesc}>Facebook</p>
                        </a>
                        <a className={style.contentItem} href='http://jatestuje.pl' target='blank' >
                            <p className={style.contentIcon}><YouTube /></p>
                            <p className={style.contentDesc}>YouTube</p>
                        </a>
                        <a className={style.contentItem} href='http://jatestuje.pl' target='blank' >
                            <p className={style.contentIcon}><Instagram /></p>
                            <p className={style.contentDesc}>Instagram</p>
                        </a>
                    </div>

                    {/* form */}
                    <div className={style.formContainerMain}>
                        <div className={style.contactUs}>
                            <ContactUs />
                        </div>
                        <div className={style.formContainer}>
                            <form className={`${style.form} ${isFormAnimation && style.formAnim}`}>
                                {isAlertShow && <Alert click={() => setIsAlertShow(false)} alertName='Przepraszamy' alertDetails='Wiadomości nie udało się wysłać. Proszę skorzystać z innej formy kontaktu' />}
                                {isSpinnerShow && <Spinner />}
                                <div className={style.inputContainer}>
                                    <input onChange={event => setInputName(event.target.value)} value={inputName} onFocus={() => setInputNameIsInvalid(false)} className={`${style.input} ${inputNameIsInvalid && style.inputIsInvalid}`} type='text' required />
                                    <label className={style.label}>Twoje imię</label>
                                </div>
                                <div className={style.inputContainer}>
                                    <input onChange={event => setInputEmail(event.target.value)} value={inputEmail} onFocus={() => setInputEmailIsInvalid(false)} className={`${style.input} ${inputEmailIsInvalid && style.inputIsInvalid}`} type='text' required />
                                    <label className={style.label}>Twój e-mail</label>
                                </div>
                                <div className={style.inputContainer}>
                                    <textarea onChange={event => setInputMessage(event.target.value)} value={inputMessage} onFocus={() => setInputMessageIsInvalid(false)} className={`${style.input} ${inputMessageIsInvalid && style.inputIsInvalid}`} type='textarea' rows='5' required />
                                    <label className={style.label}>Wiadomość</label>
                                </div>
                                <button onClick={sendMessage} className={style.btn}>Wyślij</button>
                            </form>
                            <div className={`${style.envelope} ${isFormAnimation && style.envelopeAnim}`}>
                                <Envelope />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}


export default Contact

