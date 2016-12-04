<?php
	
class CPhpSourcePlus extends CPhpMessageSource
{
  	/*
    public function init()
	{
		parent::init();
        if($this->basePath===null)
			$this->basePath=Yii::getPathOfAlias('application.messages');
	}
    */
    public function __construct()
	{
		parent::init();
	}
    
    public function messages($lang)
	{
       ///if(isset($lang))          Yii::log('GET MESSAGES A LANG='.$lang,'warning'); 
       $lang = isset($lang)?$lang:Yii::app()->language; 
	   //Yii::log('GET MESSAGES LANG='.$lang. ' session[ulang]='.Yii::app()->session['ulang'],'warning');
       return $this->loadMessages('app', $lang) ;
       ///$this->basePath=Yii::getPathOfAlias('application.messages');
       
	}   
}
