class ApiResponse{
    constructor(statuscode,data,messge="Success"){
        this.statuscode=statuscode
        this.data=data
        this.messge=messge
        this.success=statuscode <400
    }
}