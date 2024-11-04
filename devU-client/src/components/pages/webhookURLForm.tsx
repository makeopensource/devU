import React, {useState} from 'react'
import TextField from 'components/shared/inputs/textField'
import Button from 'components/shared/inputs/button'
import PageWrapper from 'components/shared/layouts/pageWrapper'
import styles from './webhookURLForm.scss'

const webhookURLForm = () => {
    const [webhookURL, setWebhookURL] = useState<string>()
    const [webhookUrls, setWebhookUrls] = useState<string[]>([])

    const handleChange = (value: string) => {
        setWebhookURL(value);
    };

    const handleAddURL = () => {
        if (webhookURL) {
            setWebhookUrls([...webhookUrls, webhookURL])
            setWebhookURL('')
        }
    }

    return (
        <PageWrapper>
            <div style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', marginTop:'30px'}}>
                <TextField id="webhookURL" label={'Webhook URL'} onChange={handleChange} sx={{width:1/2}} className={styles.textField}></TextField>
                <Button onClick={handleAddURL}>Add Webhook URL</Button>
            </div>

            <ul>
                {webhookUrls.map((url, index) => (
                    <li key={index}>{url}</li>
                ))}
            </ul>
        </PageWrapper>
    )
}

export default webhookURLForm