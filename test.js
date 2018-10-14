function WriteToFile(passForm) {
 
    var fso = CreateObject("Scripting.FileSystemObject"); 
    var s   = fso.CreateTextFile("C:\Users\Sarb-PC\streuby.github.io/db.txt", True);
 
    var firstName = document.getElementById('FirstName');
    var lastName  = document.getElementById('lastName');
 
    s.writeline("First Name :" + FirstName);
    s.writeline("Last Name :" + lastName);
 
    s.writeline("-----------------------------");
    s.Close();
 }