var LIVE2DCUBISMCORE = Live2DCubismCore
//�����Դ��CDN��һ��Ҫдhttp://����https://������Ա�����������Ϊ���·��
//ģ�͵�model3.json�ļ�·��
//var baseModelPath = 'https://npm.elemecdn.com/browse/live2dofatri@1.0.0'
//var modelNames = ["ATRI"];
var baseModelPath = 'https://npm.elemecdn.com/chenyfan-oss@2.0.2'
var modelNames = ["lafei_4"];

var modelPath;
//Applicationȫ�ֱ���
var app = null;
//ģ����Ⱦ��λ��
var tag_target = '#live2d';
//�����Ķ�������
var idleIndex;
//��¼�Ķ���������ֻ��Զ����ļ�����idel�ֶε�
var loginIndex;
//�ظ۶�����ֻ��Ա������ߵ��лظ۶����������ļ�����home�ֶ�
var homeIndex;
//ģ��ƫ��λ��
var model_x = -15;
var model_y = 40;
//��Ⱦģ�͵Ŀ���
var modelWidth = 800;
var modelHight = 700;
//��Ⱦģ�͵ı���
var scale = 30;
//�����ã�����ʱ����㣬����֤׼ȷ��
var startTime = null;
//��һ�ַ�ʽ��ʼ��ģ�ͣ�ͨ��model3.json������ȥ����
function initModelConfig(modelJson){
    var fileReferences = modelJson.FileReferences;
    var mocPath =  fileReferences.Moc;
    loadMoc(mocPath);
    var textures = fileReferences.Textures;
    loadTextures(textures);
    var phyPath = fileReferences.Physics;
    loadPhyPath(phyPath);
    for (var key in fileReferences.Motions) {
        loadMotions(fileReferences.Motions[key]);
    }
    PIXI.loader.reset();
    PIXI.utils.destroyTextureCache();
    PIXI.loader
        .on("start", loadStartHandler)
        .on("progress", loadProgressHandler)
        .on("complete", loadCompleteHandler)
        .load(function (loader, resources) {
        var canvas = document.querySelector(tag_target);
        var view = canvas.querySelector('canvas');
        if(app != null){app.stop();}
        app = new PIXI.Application(modelWidth, modelHight, {transparent: true ,view: view});
        var moc = Live2DCubismCore.Moc.fromArrayBuffer(resources['moc'].data);
        var builder = new LIVE2DCUBISMPIXI.ModelBuilder();
        builder.setMoc(moc);
        builder.setTimeScale(1);
        var textureIndex = 0;
        for (var key in resources) {
            if(key.indexOf('texture')!= -1){
                builder.addTexture(textureIndex++ , resources[key].texture);
            }
        }
        if(resources['physics']){ builder.setPhysics3Json(resources['physics'].data); }
        var model = builder.build();
        app.stage.addChild(model);
        app.stage.addChild(model.masks);
        var motions = setMotions(model,resources);
        setMouseTrick(model,app,canvas,motions);
        setOnResize(model,app);
    });
}
//����MOC�ļ�
function loadMoc(mocPath){
    if(typeof(mocPath) !== 'undefined'){
        PIXI.loader.add('moc', modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + mocPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER });
    }else{
        console.log('Not find moc');
    }
}
//���� texture �ļ�
function loadTextures(textures){
    if(textures.length >0){
        for (var i = 0; i < textures.length; i++) {
            //loadTextures;
            PIXI.loader.add('texture' + ( i + 1) , modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + textures[i]);
        }
    }else{
        console.log("Not find textures");
    }
}
// ����physics�ļ�
function loadPhyPath(phyPath){
    if(typeof(phyPath) !== 'undefined'){
        PIXI.loader.add('physics', modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + phyPath, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
    }else{
        console.log('Not find physics');
    }
}
//���ض����ļ�
function loadMotions(motions){
    //��������
    var motionCount = 0 ;
    if(motions.length >0){
        for (var i = 0; i < motions.length; i++) {
            PIXI.loader.add('motion'+ ( motionCount + 1) , modelPath.substr(0, modelPath.lastIndexOf('/') + 1) + motions[i].File, { xhrType: PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON });
            if(motions[i].File.indexOf('idle')!= -1){
                idleIndex = motionCount;
            }else if(motions[i].File.indexOf('login') != -1){
                loginIndex = motionCount;
            }else if(motions[i].File.indexOf('home') != -1){
                homeIndex = motionCount;
            }
            motionCount ++ ;
        }
    }else{
        console.error('Not find motions');
    }
}
//��һ�ֳ�ʼ��ģ�ͷ�ʽ
function initModel(data){
    var model3Obj = {data:data,url: modelPath.substr(0, modelPath.lastIndexOf('/') + 1)};
    //���loader�ڵ����ݣ�����������е�����
    PIXI.loader.reset();
    PIXI.utils.destroyTextureCache();
    for (var key in data.FileReferences.Motions) {
        loadMotions(data.FileReferences.Motions[key]);
    }
    //���ô˷���ֱ�Ӽ��أ�����������ģ�͵Ļص�����
    new LIVE2DCUBISMPIXI.ModelBuilder().buildFromModel3Json(
      PIXI.loader
        .on("start", loadStartHandler)
        .on("progress", loadProgressHandler)
        .on("complete", loadCompleteHandler),
      model3Obj,
      setModel
    );  
}
//����ģ�͵Ļص�����
function setModel(model){
    var canvas = document.querySelector(tag_target);
    var view = canvas.querySelector('canvas');
    //�ظ�����ģ���ǣ���ֹͣ��Ⱦ�������̨WebGL�ᱨ����
    if(app != null){app.stop();}
    app = new PIXI.Application(modelWidth, modelHight, {transparent: true ,view:view});
    app.stage.addChild(model);
    app.stage.addChild(model.masks);
    var motions = setMotions(model,PIXI.loader.resources);
    setMouseTrick(model,app,canvas,motions);
    setOnResize(model,app);
}
//����ģ�Ͷ���
function setMotions(model,resources){
    //�������飬��Ÿ�ʽ���õĶ�������
    var motions = [];
    for (var key in resources) {
        if(key.indexOf('motion') != -1){
            motions.push(LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(resources[key].data)); 
        }
    }
    var timeOut;
    if(motions.length > 0){
        window.clearTimeout(timeOut);
        model.animator.addLayer("motion", LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE, 1.0);
        if(null != loginIndex && null != idleIndex){//����е�¼�ʹ������������ڵ�¼������ɺ��л�����������
            model.animator.getLayer("motion").play(motions[loginIndex]);
            timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[loginIndex].duration * 1000 );
        }else{
            //���û�е�¼��������Ĭ�ϲ��ŵ�һ������
            model.animator.getLayer("motion").play(motions[0]);
        }
    }
    return motions;
}
//�������׷��
function setMouseTrick(model,app,canvas,motions){
    var rect = canvas.getBoundingClientRect();
    var center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
    var mouse_x = center_x, mouse_y = center_y;
    var angle_x = model.parameters.ids.indexOf("ParamAngleX");
    if(angle_x < 0){ angle_x = model.parameters.ids.indexOf("PARAM_ANGLE_X"); }
    var angle_y = model.parameters.ids.indexOf("ParamAngleY");
    if(angle_y < 0){ angle_y = model.parameters.ids.indexOf("PARAM_ANGLE_Y"); }
    var eye_x = model.parameters.ids.indexOf("ParamEyeBallX");
    if(eye_x < 0){ eye_x = model.parameters.ids.indexOf("PARAM_EYE_BALL_X"); }
    var eye_y = model.parameters.ids.indexOf("ParamEyeBallY");
    if(eye_y < 0){ eye_y = model.parameters.ids.indexOf("PARAM_EYE_BALL_Y"); }
    app.ticker.add(function (deltaTime) {
        rect = canvas.getBoundingClientRect();
        center_x = modelWidth/2 + rect.left, center_y = modelHight/2 + rect.top;
        var x = mouse_x - center_x;
        var y = mouse_y - center_y;
        model.parameters.values[angle_x] = x * 0.1;
        model.parameters.values[angle_y] = -y * 0.1;
        model.parameters.values[eye_x] = x * 0.005;
        model.parameters.values[eye_y] = -y * 0.005;
        model.update(deltaTime);
        model.masks.update(app.renderer);
    });
    var scrollElm = bodyOrHtml();
    var mouseMove;
    document.body.addEventListener("mousemove", function(e){
        window.clearTimeout(mouseMove);
        mouse_x = e.pageX - scrollElm.scrollLeft;
        mouse_y = e.pageY - scrollElm.scrollTop;
        mouseMove =  window.setTimeout(function(){mouse_x = center_x , mouse_y = center_y} , 5000);
    });
    var timeOut;
    document.body.addEventListener("click", function(e){
        window.clearTimeout(timeOut);
        if(motions.length == 0){ return; }
        if(rect.left < mouse_x && mouse_x < (rect.left + rect.width) && rect.top < mouse_y && mouse_y < (rect.top + rect.height)){
            var rand = Math.floor(Math.random() * motions.length);
            model.animator.getLayer("motion").stop();
            model.animator.getLayer("motion").play(motions[rand]);
            //����е�¼����������������Ŷ���������ص���������
            if(null != idleIndex){
                timeOut = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);}, motions[rand].duration * 1000 );
            }
        }
    });
    var onblur = false;
    var onfocusTime;
    sessionStorage.setItem('Onblur', '0');
    window.onblur = function(e){
        if('0' == sessionStorage.getItem('Onblur')){
            onfocusTime = setTimeout(function(){sessionStorage.setItem('Onblur','1');},30000);
        }
    };
    window.onfocus = function(e){
        window.clearTimeout(onfocusTime);
        if(motions.length > 0){
            if('1' == sessionStorage.getItem('Onblur')){
                model.animator.getLayer("motion").stop();
                if(null != loginIndex && null != idleIndex){//����лظۺʹ������������ڵ�¼������ɺ��л�����������
                    model.animator.getLayer("motion").play(motions[homeIndex]);
                    onfocusTime = setTimeout( function(){model.animator.getLayer("motion").play(motions[idleIndex]);sessionStorage.setItem('Onblur', '0');}, motions[homeIndex].duration * 1000 );
                }else{
                    //���û�У���Ĭ�ϲ��ŵ�һ������
                    model.animator.getLayer("motion").play(motions[0]);
                }
            }
        }
    };
}
//���������onResize�¼�
function setOnResize(model, app){
    var onResize = function (event) {
        if (event === void 0) { event = null; }
            var width = modelWidth;
            var height = modelHight;
            app.view.style.width = width + "px";
            app.view.style.height = height + "px";
            app.renderer.resize(width, height);
            model.position = new PIXI.Point(modelWidth/2 + model_x, modelHight/2 + model_y);
            model.scale = new PIXI.Point(scale,scale);
            model.masks.resize(app.view.width, app.view.height);
    };
    onResize();
    window.onresize = onResize;
}
//��ȡҳ�����ݷ���
function bodyOrHtml(){
    if('scrollingElement' in document){ return document.scrollingElement; }
    if(navigator.userAgent.indexOf('WebKit') != -1){ return document.body; }
    return document.documentElement;
}
//����ģ�Ϳ�ʼʱHandler
function loadStartHandler(){
    //�Ż����ؿ�ʼ��ʱ
    startTime = new Date();
    console.log("Start loading Model at " + startTime);
}
//����ģ��Handler����ؼ��ؽ���
function loadProgressHandler(loader) {
    console.log("progress: " + Math.round(loader.progress) + "%");
}
//����ģ�ͽ���Handler
function loadCompleteHandler(){
    var loadTime = new Date().getTime() - startTime.getTime();
    console.log('Model initialized in '+ loadTime/1000 + ' second');
    PIXI.loader.off("start", loadStartHandler);//�����¼��ڼ�����Ϻ�ȡ��
    PIXI.loader.off("progress", loadProgressHandler);//�����¼��ڼ�����Ϻ�ȡ��
    PIXI.loader.off("complete", loadCompleteHandler);//�����¼��ڼ�����Ϻ�ȡ��
}
//�򵥷���AJAX�첽�����ȡjson�ļ�
function loadModel(){
    //���ģ�ͣ������ָ��ģ�Ϳ��Խ����ֵ��Ϊָ����������ֱ�Ӵ�ָ��ģ����
    var modelName =  modelNames[Math.floor(Math.random() * modelNames.length )];
    //ƴ��·��
    //���model3���ļ�����baseModelPath/xxx/xxx.model3.json�����治���޸ģ��������ļ�·�������޸�
    //modelPath =  baseModelPath + modelName + "/" + modelName + ".model3.json";
    modelPath = baseModelPath + "/" + modelName + ".model3.json";
    var ajax = null;
    if(window.XMLHttpRequest){ajax = new XMLHttpRequest();}else if(window.ActiveObject){
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
    }else{
        throw new Error('loadModelJsonError');
    }  
    ajax.open('GET', modelPath, true);
    ajax.send();
    ajax.onreadystatechange = function(){
        if(ajax.readyState == 4){  
            if(ajax.status == 200){ 
                var data = JSON.parse(ajax.responseText)
                //initModelConfig(data);
                initModel(data);
            }else{
                console.error('Response error,Code:' + ajax.status);
            }
        }
    };
}