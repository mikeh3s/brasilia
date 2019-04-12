<?php 
// Cut_Str;
//截取字符串
//$sourcestr 是要处理的字符串 
//$cutlength 为截取的长度(即字数) 
function cut_str($sourcestr,$cutlength) 
{ 
   $returnstr=''; 
   $i=0; 
   $n=0; 
   $str_length=strlen($sourcestr);//字符串的字节数 
   while (($n<$cutlength) and ($i<=$str_length)) 
   { 
      $temp_str=substr($sourcestr,$i,1); 
      $ascnum=Ord($temp_str);//得到字符串中第$i位字符的ascii码 
      if ($ascnum>=224)    //如果ASCII位高与224，
      { 
         $returnstr=$returnstr.substr($sourcestr,$i,3); //根据UTF-8编码规范，将3个连续的字符计为单个字符         
         $i=$i+3;            //实际Byte计为3
         $n++;            //字串长度计1
      }
      elseif ($ascnum>=192) //如果ASCII位高与192，
      { 
         $returnstr=$returnstr.substr($sourcestr,$i,2); //根据UTF-8编码规范，将2个连续的字符计为单个字符 
         $i=$i+2;            //实际Byte计为2
         $n++;            //字串长度计1
      }
      elseif ($ascnum>=65 && $ascnum<=90) //如果是大写字母，
      { 
         $returnstr=$returnstr.substr($sourcestr,$i,1); 
         $i=$i+1;            //实际的Byte数仍计1个
         $n++;            //但考虑整体美观，大写字母计成一个高位字符
      }
      else                //其他情况下，包括小写字母和半角标点符号，
      { 
         $returnstr=$returnstr.substr($sourcestr,$i,1); 
         $i=$i+1;            //实际的Byte数计1个
         $n=$n+0.5;        //小写字母和半角标点等与半个高位字符宽...
      } 
   } 
      if ($i<$str_length){
          $returnstr = $returnstr . "...";//超过长度时在尾处加上省略号
      }
    return $returnstr;

}

//截取utf-8字符串函数

function FSubstr($title,$start,$len="",$magic=true) 
{
 if($len == "") $len=strlen($title);
 
 if($start != 0)
 {
  $startv = ord(substr($title,$start,1));
  if($startv >= 128)
  {
   if($startv < 192)
   {
    for($i=$start-1;$i>0;$i--)
    {
     $tempv = ord(substr($title,$i,1));
     if($tempv >= 192) break;
    }
    $start = $i;
   }
  }
 }
 
 if(strlen($title)<=$len) return substr($title,$start,$len);
 
 $alen   = 0;
 $blen = 0;
 
 $realnum = 0;
 
 for($i=$start;$i<strlen($title);$i++)
 {
  $ctype = 0;
  $cstep = 0;
  
  $cur = substr($title,$i,1);
  if($cur == "&")
  {
   if(substr($title,$i,4) == "&lt;")
   {
    $cstep = 4;
    $length += 4;
    $i += 3;
    $realnum ++;
    if($magic)
    {
     $alen ++;
    }
   }
   else if(substr($title,$i,4) == "&gt;")
   {
    $cstep = 4;
    $length += 4;
    $i += 3;
    $realnum ++;
    if($magic)
    {
     $alen ++;
    }
   }
   else if(substr($title,$i,5) == "&amp;")
   {
    $cstep = 5;
    $length += 5;
    $i += 4;
    $realnum ++;
    if($magic)
    {
     $alen ++;
    }
   }
   else if(substr($title,$i,6) == "&quot;")
   {
    $cstep = 6;
    $length += 6;
    $i += 5;
    $realnum ++;
    if($magic)
    {
     $alen ++;
    }
   }
   else if(preg_match("/&#(\d+);?/i",substr($title,$i,8),$match))
   {
    $cstep = strlen($match[0]);
    $length += strlen($match[0]);
    $i += strlen($match[0])-1;
    $realnum ++;
    if($magic)
    {
     $blen ++;
     $ctype = 1;
    }
   }
  }else{
   if(ord($cur)>=252)
   {
    $cstep = 6;
    $length += 6;
    $i += 5;
    $realnum ++;
    if($magic)
    {
     $blen ++;
     $ctype = 1;
    }
   }elseif(ord($cur)>=248){
    $cstep = 5;
    $length += 5;
    $i += 4;
    $realnum ++;
    if($magic)
    {
     $ctype = 1;
     $blen ++;
    }
   }elseif(ord($cur)>=240){
    $cstep = 4;
    $length += 4;
    $i += 3;
    $realnum ++;
    if($magic)
    {
     $blen ++;
     $ctype = 1;
    }
   }elseif(ord($cur)>=224){
    $cstep = 3;
    $length += 3;
    $i += 2;
    $realnum ++;
    if($magic)
    {
     $ctype = 1;
     $blen ++;
    }
   }elseif(ord($cur)>=192){
    $cstep = 2;
    $length += 2;
    $i += 1;
    $realnum ++;
    if($magic)
    {
     $blen ++;
     $ctype = 1;
    }
   }elseif(ord($cur)>=128){
    $length += 1;
   }else{
    $cstep = 1;
    $length +=1;
    $realnum ++;
    if($magic)
    {
     if(ord($cur) >= 65 && ord($cur) <= 90)
     {
      $blen++;
     }else{


      $alen++;
     }
    }
   }
  }
  
  if($magic)
  {
   if(($blen*2+$alen) == ($len*2)) break;
   if(($blen*2+$alen) == ($len*2+1))
   {
    if($ctype == 1)
    {
     $length -= $cstep;
     break;
    }else{
     break;
    }
   }
  }else{
   if($realnum == $len) break;
  }
 }
 
 unset($cur);
 unset($alen);
 unset($blen);
 unset($realnum);
 unset($ctype);
 unset($cstep);
 
 return substr($title,$start,$length);
}
?>