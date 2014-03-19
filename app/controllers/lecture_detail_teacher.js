var args = arguments[0] || {};
var AppData = require('data');
var dataId = (args.dataId === 0 || args.dataId > 0) ? args.dataId : '';
var dateStamp= args.dateStamp;
if(!dataId)
	console.log("Form:"+dataId);

function actionHomeworkCheckbox (e)
{
	if(e.source.check)	{
		e.source.image="/images/unchecked.png";
		e.source.check=false;
	}else	{
		e.source.image="/images/checked.png";
		e.source.check=true;
	}
}

function actionTestCheckbox (e)
{
	if(e.source.check)	{
		e.source.image="/images/unchecked.png";
		e.source.check=false;
	}else	{
		e.source.image="/images/checked.png";
		e.source.check=true;
	}
}