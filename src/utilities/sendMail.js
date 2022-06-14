import sgMail from '@sendgrid/mail'
import { config } from '../configs/general.config'

sgMail.setApiKey(config.sgApiKey)

export const sendMail = async (to, text, subject, html ) => {
  await sgMail.send({to, from: config.founderMail, text, subject, html })
}