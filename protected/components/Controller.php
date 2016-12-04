<?php

/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	
	public $pageTitle;
	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu=array();
	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();
	public $topSideMenu;
	
	public $layoutTemplate='main';
    //public $layoutTemplate='main.backbone';
	
	public function layoutTemplatePath() { return Yii::app()->basePath.DIRECTORY_SEPARATOR.'templates'.DIRECTORY_SEPARATOR ;}
	public function layoutLangTemplatePath() { return Yii::app()->basePath.DIRECTORY_SEPARATOR.'templates'.
		DIRECTORY_SEPARATOR.'lang'.DIRECTORY_SEPARATOR.Yii::app()->language.DIRECTORY_SEPARATOR;}
	
	private function templateLoaders($dir)
	{
	  $app = Yii::app();
	  $loaders = array();
	  $lang_dir = $app->basePath.'/templates/lang/'.Yii::app()->language.DIRECTORY_SEPARATOR.$dir;
	  if (is_dir($lang_dir)) 
		$loaders[] = new Mustache_Loader_FilesystemLoader($lang_dir);
	  $loaders[] = new Mustache_Loader_FilesystemLoader($app->basePath.'/templates/'.$dir); 	
	  return $loaders;
	}
	
	//attentions! do not use partials! use hier accessible templates (thanx sir/mam)
	public function mustacheRender($view, $searchPath, $rgs=null)
	{
		$config = array(
			'cache'=> Yii::app()->basePath.'/runtime/Mustache/cash',

		);
		
		$app = Yii::app();
        $baseUrl = $app->getBaseUrl(true);
		$rgs = array_merge($rgs, array( 
			'baseUrl'=> $baseUrl,
			'staticUrl'=> $baseUrl,
			'vendorUrl'=> $baseUrl.'/assets/bower_components',
			'appName' => $app->name,
			'username'=>$app->user->name, 
			'authenticated'=>User::is_logged_in(),
			'pageTitle'=>$this->pageTitle,
			'rights'=>Yii::t('app','rights',array(':d'=>'2013'/*date('Y')*/)),
		));	
		
		if(isset($this->layoutTemplate))
		{
			$config['loader'] = new Mustache_Loader_CascadingLoader($this->templateLoaders('layouts'));

			$rgs['content']=$this->mustacheRenderPartial($view,$searchPath,$rgs);
			
			$view = $this->layoutTemplate;
			$rgs['topNavbar']=$this->mustacheRenderPartial('topNavbar', 'layouts',
				array_merge($rgs, array(
					'labels'=>(new TopNavbarHelper)->attributeLabels(),
					'langs'=>array(
						'current'=>Yii::t('lang',$app->language),
						//put hier your own langs
						'en_us'=>Yii::t('lang','en_us'),
						'ru_ru'=>Yii::t('lang','ru_ru'),
					)
				)
			));
			$rgs['userMenu']=$this->mustacheRenderPartial('userMenu', 'layouts',
				array_merge($rgs, array('labels'=>(new UserMenuHelper)->attributeLabels())
			));
			$rgs['cartMenu']=$this->mustacheRenderPartial('cartMenu', 'layouts',
				array_merge($rgs, array('model'=>$app->session['cart'],'labels'=>(new CartMenuHelper)->attributeLabels())
			));
			
			if($this->topSideMenu)
				$rgs['topsideMenu']=$this->mustacheRenderPartial('topsideMenu', $this->topSideMenu['templatePath'],
					array_merge($rgs, $this->topSideMenu['args']));
				
		}else{
			$config['loader'] = new Mustache_Loader_FilesystemLoader($this->layoutTemplatePath().$searchPath);	
		}
		$m = new Mustache_Engine($config);
		echo $m->render($view,$rgs);
	}
	
	public function mustacheRenderPartial($view, $searchPath, $rgs=null)
	{
		$app = Yii::app();
		$config = array(
			'cache'=> $app->basePath.'/runtime/Mustache/cash',
			'loader' => new Mustache_Loader_CascadingLoader($this->templateLoaders($searchPath)),
		);	
		
		

		$m = new Mustache_Engine($config);
		return $m->render($view,$rgs);
	}
	
	public function renderView($view, $searchPath, $rgs=null) 
	{
		return $this->mustacheRenderPartial($view, $searchPath, $rgs);
	}
    
    public function startBackbone($rgs = [])
    {
      $app = Yii::app();
      $loaders = [];
	  $lang_dir = 'js/templates/lang/';
	  if (is_dir($lang_dir)) 
		$loaders[] = new Mustache_Loader_FilesystemLoader($lang_dir);
	  $loaders[] = new Mustache_Loader_FilesystemLoader('js/templates/'); 
      
	  $config = array(
			'cache'=> $app->basePath.'/runtime/Mustache/cash',
			'loader' => new Mustache_Loader_CascadingLoader($this->templateLoaders('layouts')),
	  );
      $baseUrl = $app->getBaseUrl(true);
	  $rgs = array_merge($rgs, array( 
			'baseUrl'=> $baseUrl,
			'staticUrl'=> $baseUrl,
			'vendorUrl'=> $baseUrl.'/assets/bower_components',
			'appName' => $app->name,
			'username'=>$app->user->name, 
			'authenticated'=>User::is_logged_in(),
			'pageTitle'=>$this->pageTitle,
			'rights'=>Yii::t('app','rights',array(':d'=>'2013'/*date('Y')*/)),
		));	
		
      $m = new Mustache_Engine($config);
      echo $m->render('main.backbone',$rgs);  
    }
    
    	 /**
     * Send raw HTTP response
     * @param int $status HTTP status code
     * @param string $body The body of the HTTP response
     * @param string $contentType Header content-type
     * @return HTTP response
     */
    protected function sendResponse($status = 200, $body = '', $contentType = 'application/json')
    {
        // Set the status
        $statusHeader = 'HTTP/1.1 ' . $status . ' ' . $this->getStatusCodeMessage($status);
        header($statusHeader);
        // Set the content type
        header('Content-type: ' . $contentType);

        echo $body;
        Yii::app()->end();
    }
	
    protected function getStatusCodeMessage($status)
    {
        $codes = array(
            100 => 'Continue',
            101 => 'Switching Protocols',
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            203 => 'Non-Authoritative Information',
            204 => 'No Content',
            205 => 'Reset Content',
            206 => 'Partial Content',
            300 => 'Multiple Choices',
            301 => 'Moved Permanently',
            302 => 'Found',
            303 => 'See Other',
            304 => 'Not Modified',
            305 => 'Use Proxy',
            306 => '(Unused)',
            307 => 'Temporary Redirect',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            402 => 'Payment Required',
            403 => 'Forbidden',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            406 => 'Not Acceptable',
            407 => 'Proxy Authentication Required',
            408 => 'Request Timeout',
            409 => 'Conflict',
            410 => 'Gone',
            411 => 'Length Required',
            412 => 'Precondition Failed',
            413 => 'Request Entity Too Large',
            414 => 'Request-URI Too Long',
            415 => 'Unsupported Media Type',
            416 => 'Requested Range Not Satisfiable',
            417 => 'Expectation Failed',
            500 => 'Internal Server Error',
            501 => 'Not Implemented',
            502 => 'Bad Gateway',
            503 => 'Service Unavailable',
            504 => 'Gateway Timeout',
            505 => 'HTTP Version Not Supported',
        );
        return (isset($codes[$status])) ? $codes[$status] : '';
    }
	
	function ajax_required()
	{
		///Yii::log('no AJAX request','warning');
		$this->sendResponse(200, 'AJAX is required, request='.Yii::app()->request->requestType);
	}
}
