<?php
require('RestController.php');

class ContactController extends RestController
{
	protected $selfModel = 'ContactForm';
	public  $title = "eShop Contact Management";

	public function actions()
	{
		return array(
			// captcha action renders the CAPTCHA image displayed on the contact page
			'captcha'=>array(
				'class'=>'CCaptchaAction',
				'backColor'=>0xFFFFFF,
			),
		);
	}	

	protected function modelUpdate(CModel $model, array $data)
	{
		///Yii::log('modelUpdate is called request='.Yii::app()->request->requestType,'warning');
		$model->attributes = $data;
		if($model->validate())
		{
				$headers="From: {$model->email}\r\nReply-To: {$model->email}";
				mail(Yii::app()->params['adminEmail'],$model->subject,$model->body,$headers);
				//Yii::app()->user->setFlash('contact',
				$message =	(Yii::app()->language == 'en_us')?
					'Thank you for contacting us. We will respond to you as soon as possible.':
					Yii::t('longtext','contact4');
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>true, 
					'message'=>array('confirmation'=>$message))));	
		}else
				$this->sendResponse(200, CJSON::encode(array(
					'valid'=>false, 
					'message'=>$model->errors)));
	}

	
	
}
